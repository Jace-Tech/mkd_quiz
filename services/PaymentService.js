require('dotenv').config(); //require .env for stripe configurations
const moment = require('moment');
const stripe = require('./StripeApi'); //this is Payment Service
const paypal = require('./PaypalApi');
const db = require('../models');
const userModel = db.user;
const stripeSubscriptionsModel = db.stripe_subscriptions;
const stripeSubscriptionsLogModel = db.stripe_subscriptions_log;
const paymentPlansModel = db.payment_plans;
const stripeProductsModel = db.stripe_products;
const paymentServicesModel = db.payment_services;
const stripeCardsModel = db.stripe_cards;

module.exports = new Service();
function Service() {
  this.userId = 0;
  this.roleId = 0;
  this.currency = process.env.STRIPE_CURRENCY;
  this.prorate = process.env.STRIPE_PRORATE;
  this.forceCancel = process.env.STRIPE_FORCE_CANCEL;

  this.setUserId = function (userId) {
    this.userId = userId;
  };
  this.setRoleId = function (roleId) {
    this.roleId = roleId;
  };
  this.setCurrency = function (currency) {
    this.currency = currency;
  };
  this.setProrationType = function (prorate) {
    this.prorate = prorate;
  };
  this.setCancelType = function (forceCancel) {
    this.forceCancel = forceCancel;
  };
  let convertToCents = function (amount) {
    return amount * 100;
  };
  let handleDBError = function (error) {
    console.error(error);
    throw new Error('Internal error: Database error');
  };
  let handleRequestError = function (error) {
    console.error(error);
    throw new Error('Internal error: Request error');
  };

  this.subscribe = async function (subscriptionParams, plan) {
    var subscription = await stripe.createSubscription(subscriptionParams);
    //create model entry
    let subscriptionModelEntry = {
      stripe_id: subscription.id ?? '',
      cancel_at_period_end: subscription.cancel_at_period_end ?? null,
      current_period_start: moment(new Date(subscription.current_period_start * 1000)).format('YYYY-MM-DD') ?? null,
      current_period_end: moment(new Date(subscription.current_period_end * 1000)).format('YYYY-MM-DD') ?? null,
      user_id: this.userId ?? null,
      role_id: this.roleId ?? null,
      plan_id: plan?.id ?? null,
      coupon_stripe_id: subscription.discount?.coupon?.id ?? '',
      customer_stripe_id: subscription.customer ?? '',
      collection_method: subscription.collection_method ?? '',
      interval: stripeSubscriptionsModel.inverse_interval_mapping(subscription.plan?.interval) ?? 0,
      interval_count: subscription.plan?.interval_count ?? '',
      trial_period_days: subscription.plan?.trial_period_days ?? 0,
      trial_end: subscription.trial_end ? moment(new Date(subscription.trial_end * 1000)).format('YYYY-MM-DD') : null,
      trial_start: subscription.trial_start ? moment(new Date(subscription.subscriptiontrial_start * 1000)).format('YYYY-MM-DD') : null,
      status: stripeSubscriptionsModel.inverse_status_mapping(subscription.status) ?? null,
    };

    let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
    if (!subscriptionCreatedId) {
      throw new Error('Subscription is not found.');
    }

    let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, subscription.status, plan);
    if (!subscriptionLogUpdated) {
      throw new Error('Error while editing subscription log');
    }
    return subscriptionCreatedId;
  };
  this.updateSubscriptionLog = async function (subscriptionCreatedId, subscriptionCreatedStatus, plan) {
    let subscriptionLog = await stripeSubscriptionsLogModel.getLast({ user_id: this.userId, role_id: this.roleId });

    if (!subscriptionLog) {
      let subscriptionLogModelEntry = {
        user_id: this.userId,
        role_id: this.roleId,
        plan_id: plan?.id ?? null,
        subscription_id: subscriptionCreatedId,
        type: plan?.type ?? null,
        status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
      };
      if (!(await stripeSubscriptionsLogModel.insert(subscriptionLogModelEntry))) {
        throw new Error('Subscription log add not successfull');
      }
    } else {
      let subscriptionLogModelEntry = {
        plan_id: plan?.id ?? null,
        subscription_id: subscriptionCreatedId,
        type: plan?.type ?? null,
        status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
      };

      if (!(await stripeSubscriptionsLogModel.edit(subscriptionLogModelEntry, subscriptionLog.id))) {
        throw new Error('Subscription log edit not successfull');
      }
    }
    return true;
  };
  this.createRegularSubscription = async function (user, plan, card, coupon) {
    let subscriptionParams = {
      customer: user.stripe_id,
      items: [{ price: plan.stripe_id }],
      trial_from_plan: true,
      default_payment_method: card.stripe_card_id,
      coupon: coupon?.stripe_id ?? null,
    };
    return await this.subscribe(subscriptionParams, plan);
  };
  this.createLifetimeSubscription = async function (user, plan, card, coupon) {
    //create invoice, finalize and pay it.
    let lifetimePlanStripeObject = await stripe.retrievePrice(plan.stripe_id);
    let invoiceItemParams = {
      customer: user.stripe_id,
      price: plan.stripe_id,
      discounts: [{ coupon: coupon?.stripe_id }],
    };
    let invoiceItemCreated = await stripe.createInvoiceItem(invoiceItemParams);

    let invoiceParams = {
      customer: user.stripe_id,
      default_payment_method: card?.stripe_card_id ?? null,
    };
    let invoiceCreated = await stripe.createInvoice(invoiceParams);

    let invoicePaid = await stripe.payInvoice(invoiceCreated.id);

    let subscriptionModelEntry = {
      stripe_id: invoiceItemCreated.id ?? '',
      cancel_at_period_end: null,
      current_period_start: moment().format('YYYY-MM-DD') ?? null,
      current_period_end: null,
      user_id: this.userId ?? null,
      role_id: this.roleId ?? null,
      plan_id: plan?.id ?? null,
      coupon_stripe_id: invoiceItemCreated.discounts.length > 0 ? coupon?.stripe_id : '',
      customer_stripe_id: invoicePaid.customer ?? '',
      collection_method: invoicePaid.collection_method ?? '',
      interval: 4,
      interval_count: null,
      trial_period_days: 0,
      trial_end: null,
      trial_start: null,
      status: 4,
    };

    let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
    if (!subscriptionCreatedId) {
      throw new Error('Subscription is not found.');
    }

    let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, 'active', plan);
    if (!subscriptionLogUpdated) {
      throw new Error('Error while editing subscription log');
    }

    return subscriptionCreatedId;
  };
  let calculateFullPeriod = function (interval, interval_count = 1) {
    let totalNumberOfDays = paymentPlansModel.interval_days_mapping()[interval] * interval_count;
    let cancelAtEpoch = moment().add(totalNumberOfDays, 'days').unix();
    return cancelAtEpoch;
  };
  this.createTrialSubscription = async function (user, plan, card, coupon) {
    let trialPlanFullPeriod = calculateFullPeriod(plan.interval, plan.interval_count);
    let subscriptionParams = {
      customer: user.stripe_id,
      items: [{ price: plan.stripe_id }],
      trial_from_plan: true,
      default_payment_method: card.stripe_card_id,
      coupon: coupon?.stripe_id ?? null,
      cancel_at: trialPlanFullPeriod,
    };
    return await this.subscribe(subscriptionParams, plan);
  };
  this.cancelRegularSubscription = async function (subscription) {
    if (this.forceCancel === 'true') {
      var cancellationParams = {
        subscriptionId: subscription.stripe_id,
        params: {
          invoice_now: true,
          prorate: this.prorate,
        },
      };
      let subscriptionCanceled = await stripe.cancelSubscription(cancellationParams);

      let newStatus = stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status];
      await stripeSubscriptionsModel.edit({ status: newStatus }, subscription.id);
    } else {
      let updateParams = {
        subscriptionId: subscription.stripe_id,
        params: {
          cancel_at_period_end: true,
        },
      };
      await stripe.updateSubscription(updateParams);
      await stripeSubscriptionsModel.edit({ cancel_at_period_end: 1 }, subscription.id);
    }
  };
  this.cancelLifetimeSubscription = async function (subscription) {
    //TODO check if we refund on this or not
    //we could make a fixed refund amount
    //right now we just cancel it locally and refund is never as it is a onetime product thing.
    let subscriptionEdited = await stripeSubscriptionsModel.edit({ status: 5 }, parseInt(subscription.id));
    if (!subscriptionEdited) {
      throw new Error("Couldn't edit subscription");
    }
    let subscriptionLog = await stripeSubscriptionsLogModel.getByFields({ subscription_id: parseInt(subscription.id), status: 1 });
    if (!subscriptionLog) {
      throw new Error("Couldn't find relative active subscription log");
    }
    let subscriptionLogEdited = await stripeSubscriptionsLogModel.edit({ status: 0 }, subscriptionLog.id);
    if (subscriptionLogEdited) {
      return true;
    }
    throw new Error("Couldn't Edit subscription log");
  };
  this.createCustomerWithoutCard = async function (params) {
    let createdCustomer = await stripe.createCustomer(params);

    let userModelEntry = {
      stripe_id: createdCustomer.id,
    };
    let modelEditedUser = await this.userModel.edit(userModelEntry, this.userId);
    if (!modelEditedUser) {
      throw new Error('Internal error: Error editing user stripe id');
    }
    return modelEditedUser;
  };
  this.createCustomer = async function (params) {
    let createdCustomer = await stripe.createCustomer(params);
    let userModelEntry = {
      stripe_id: createdCustomer.id,
    };
    let editedUserModel = await userModel.edit(userModelEntry, this.userId);
    if (!editedUserModel) {
      throw new Error('Error editing user stripe id');
    }

    let customerCardParams = {
      customerId: createdCustomer.id,
      cardId: createdCustomer.default_source,
    };
    let card = await stripe.retrieveCard(customerCardParams);

    if (card) {
      cardModelEntry = {
        card_last: card.last4 ?? '',
        card_brand: card.brand ?? '',
        card_exp_month: card.exp_month ?? '',
        exp_year: card.exp_year ?? '',
        card_name: createdCustomer.metadata.card_name ?? '',
        stripe_card_customer: card.customer,
        stripe_card_id: card.id,
        is_default: createdCustomer.metadata.is_default,
        user_id: this.userId ?? null,
        role_id: this.roleId ?? null,
      };
      var modelCreatedCard = await stripeCardsModel.insert(cardModelEntry);
      if (!modelCreatedCard) {
        throw new Error('Internal error: Error adding card');
      }
    }
    return modelCreatedCard;
  };

  this.adminCreateProductPrice = async function (productStripeId, price, productLocalId) {
    let priceArgs = {
      unit_amount: convertToCents(price),
      currency: this.currency,
      product: productStripeId,
    };
    let priceCreated = await stripe.createPrice(priceArgs);

    let productModelEditEntry = {
      price,
      price_stripe_id: priceCreated.id,
    };
    let modelEditedProduct = await stripeProductsModel.edit(productModelEditEntry, productLocalId);
    if (!modelEditedProduct) {
      throw new Error('Internal Error: error setting price');
    }
    return priceCreated;
  };

  this.adminCreateProduct = async function (stripeProductParam, paypalProductParam, localProductType) {
    if (!stripeProductParam.name) {
      throw new Error('Must provide a name for your product');
    }
    await paypal.setAccessToken();
    let createdStripeProduct = await stripe.createProduct(stripeProductParam);
    if (localProductType == 0) {
      let productModelEntry = {
        stripe_id: createdStripeProduct.id,
        name: createdStripeProduct.name,
        status: createdStripeProduct.active ? 1 : 0,
        description: createdStripeProduct.description ?? '',
        images: createdStripeProduct.images.join(';;;'),
        shippable: createdStripeProduct.shippable ?? 0,
        unit_label: createdStripeProduct.unit_label ?? '',
        statement_descriptor: createdStripeProduct.statement_descriptor ?? '',
      };

      let modelCreatedStripeProduct = await stripeProductsModel.insert(productModelEntry);

      if (!modelCreatedStripeProduct) {
        throw new Error('Internal error: error adding a product');
      }
      return {
        productStripeId: createdStripeProduct.id,
        productLocalId: modelCreatedStripeProduct,
      };
    } else if (localProductType == 1) {
      let createdPaypalProduct = await paypal.createProduct(paypalProductParam);

      let paymentServiceModelEntry = {
        name: createdStripeProduct.name,
        stripe_id: createdStripeProduct.id,
        paypal_id: createdPaypalProduct.data.id,
        status: createdStripeProduct.active ? 1 : 0,
        image: createdStripeProduct.images.length > 0 ? createdStripeProduct.images[0] : '',
        url: createdStripeProduct.url ?? '',
        category: createdStripeProduct.metadata.category,
        description: createdStripeProduct.description ?? '',
      };

      let modelCreatedServiceId = await paymentServicesModel.insert(paymentServiceModelEntry);

      let service = paymentServicesModel.getByPK(modelCreatedServiceId);

      return {
        serviceProductStripeId: service.stripe_id,
        serviceProductPaypalId: service.paypal_id,
        serviceProductLocalId: service.id,
      };
    }
    return false;
  };

  /**
   * [adminCreateSubscriptionPlan       allows an admin to create subscription plan through admin portal]
   * @param  {object}   planParams      [object that contain plan parameters]
   * @param  {integer}  planType        [integer that represent plan type in relative to stripe plans table] @see /models/stripe_plans.js type_mapping()
   * @param  {integer}  localProductId  [integer that represent product id in relative to stripe products table]
   * @return {integer}                  [the id of the created plan in database]
   */
  this.adminCreateSubscriptionPlan = async function (params, planType, localServiceId) {
    if (!params.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    if (!planType) {
      throw new Error('Must provide plan type');
    }
    await paypal.setAccessToken();
    let service = await paymentServicesModel.getByPK(localServiceId);

    let stripeSubscriptionPlanParams = {
      nickname: params.nickname,
      currency: process.env.STRIPE_CURRENCY,
      unit_amount: convertToCents(params.amount),
      product: service.stripe_id,
      recurring: {
        interval: paymentPlansModel.interval_mapping()[params.interval],
        interval_count: params.interval_count,
        trial_period_days: params.trial_period_days,
      },
      active: parseInt(params.status) === 1 ? true : false,
    };
    let paypalSubscriptionPlanParams = {
      product_id: service.paypal_id,
      name: params.nickname,
      billing_cycles: [
        {
          frequency: {
            interval_unit: paymentPlansModel.interval_mapping()[params.interval].toUpperCase(),
            interval_count: params.interval_count,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: params.amount,
              currency_code: this.currency.toUpperCase(),
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 0,
      },
    };
    if (params.trial_period_days > 0) {
      paypalSubscriptionPlanParams.billing_cycles[0].sequence = 2;
      paypalSubscriptionPlanParams.billing_cycles.unshift({
        frequency: {
          interval_unit: 'DAY',
          interval_count: parseInt(params.trial_period_days),
        },
        tenure_type: 'TRIAL',
        sequence: 1,
        total_cycles: 1,
      });
    }

    let stripePlanCreated = await stripe.createPrice(stripeSubscriptionPlanParams);
    let paypalPlanCreated = await paypal.createSubscriptionPlan(paypalSubscriptionPlanParams);

    let planModelEntry = {
      stripe_product_id: stripePlanCreated.product,
      paypal_product_id: paypalPlanCreated.data.product_id,
      stripe_id: stripePlanCreated.id,
      paypal_id: paypalPlanCreated.data.id,
      amount: stripePlanCreated.unit_amount / 100,
      interval: paymentPlansModel.inverse_interval_mapping(stripePlanCreated.recurring.interval),
      interval_count: stripePlanCreated.recurring.interval_count,
      trial_period_days: stripePlanCreated.recurring.trial_period_days ?? 0,
      nickname: stripePlanCreated.nickname,
      service_id: localServiceId,
      status: stripePlanCreated.active ? 1 : 0,
      type: parseInt(planType),
    };

    let modelCreatedPlan = await paymentPlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this._createStripeLifetimePlan = async function (params, service) {
    //stripe doesn't have lifetime plans
    //how it works is a price is created with no recurring parameter as a single time product
    //which acts and dealt with internally within our system as a lifetime plan.
    let stripeSubscriptionPlanParams = {
      nickname: params.nickname,
      currency: this.currency,
      unit_amount: convertToCents(params.amount),
      product: service.stripe_id,
      active: parseInt(params.status) === 1 ? true : false,
    };
    return await stripe.createPrice(stripeSubscriptionPlanParams);
  };
  this._createPaypalLifetimePlan = async function (params, service) {
    //paypal doesn't allow lifetime plan
    //how it works is i create a blan with a trial with 999 years and setup fee for subscription as the main amount for the lifetime plan
    //paypal needs to have a regular plan so after the 999 years there is a regular plan with 0.01 amount money
    //this works for both lifetime paid and free plans.
    await paypal.setAccessToken();

    let paypalSubscriptionPlanParams = {
      product_id: service.paypal_id,
      name: params.nickname,
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 999,
        },
        {
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '0.01',
              currency_code: this.currency.toUpperCase(),
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: params.amount,
          currency_code: this.currency.toUpperCase(),
        },
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 0,
      },
    };
    return await paypal.createPlan(paypalSubscriptionPlanParams);
  };
  this._destroyStripeLifetimePlan = async function (planStripeId) {
    //stripe doesn't allow deleting a price. will be set to unactive instead
    return await stripe.updatePrice({ priceId: planStripeId, params: { active: false } });
  };
  this._destroyPaypalLifetimePlan = async function (planPaypalId) {
    //paypal doesn't allow deleting a price. will be set to unactive instead
    return await paypal.deactivatePlan(planPaypalId);
  };

  this.adminCreateLifetimePlan = async function (params, planType, localServiceId) {
    if (!params.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    if (!planType) {
      throw new Error('Must provide plan type');
    }
    if (parseInt(params.interval) !== 4) {
      throw new Error('Interval must be "forever".');
    }

    let service = await paymentServicesModel.getByPK(localServiceId);

    let stripePlanCreated = await this._createStripeLifetimePlan(params, service);
    let paypalPlanCreated = await this._createPaypalLifetimePlan(params, service);

    if (!stripePlanCreated && paypalPlanCreated) {
      await this._destroyPaypalLifetimePlan(paypalPlanCreated.data.id);
      throw new Error('Internal Error: Something happended while creating the plans.');
    }
    if (!paypalPlanCreated && stripePlanCreated) {
      await this._destroyStripeLifetimePlan(stripePlanCreated.id);
      throw new Error('Internal Error: Something happended while creating the plans.');
    }

    let planModelEntry = {
      stripe_product_id: stripePlanCreated?.product ?? '',
      paypal_product_id: paypalPlanCreated?.data?.product_id ?? '',
      stripe_id: stripePlanCreated?.id ?? '',
      paypal_id: paypalPlanCreated?.data?.id ?? '',
      amount: stripePlanCreated?.unit_amount ? stripePlanCreated.unit_amount / 100 : params.amount,
      interval: 4,
      interval_count: 1,
      trial_period_days: 0,
      nickname: stripePlanCreated?.nickname ?? paypalPlanCreated.data.name,
      service_id: localServiceId,
      status: stripePlanCreated?.active == true ? 1 : params.status,
      type: parseInt(planType),
    };

    let modelCreatedPlan = await paymentPlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this.adminCreateTrialPlan = async function (planParams, planType, localServiceId) {
    if (Object.keys(planParams.recurring).length === 0 || planParams.recurring.constructor !== Object) {
      throw new Error('Must have a recurring parameter (subscription interval)');
    }
    if (!planParams.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    let priceCreated = await stripe.createPrice(planParams);

    let planModelEntry = {
      stripe_product_id: priceCreated.product,
      stripe_id: priceCreated.id,
      amount: priceCreated.unit_amount / 100,
      interval: paymentPlansModel.inverse_interval_mapping(priceCreated.recurring.interval),
      interval_count: priceCreated.recurring.interval_count,
      trial_period_days: priceCreated.recurring.trial_period_days ?? 0,
      nickname: priceCreated.nickname,
      service_id: localServiceId,
      status: priceCreated.active ? 1 : 0,
      type: parseInt(planType),
    };
    let modelCreatedPlan = await paymentPlansModel.insert(planModelEntry);
    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };
  this.adminCancelSubscription = async function (subscriptionId) {
    let subscriptionToCancel = await stripeSubscriptionsModel.getByPK(subscriptionId);
    let subscriptionPlan = await paymentPlansModel.getByPK(subscriptionToCancel.plan_id);
    if (!subscriptionToCancel || !subscriptionPlan) {
      throw new Error('No subscription or plan of that id');
    }
    // let subscirptionType = subscriptionPlan.type;
    let subscirptionType = 3;
    //if normal subscription
    switch (subscirptionType) {
      case 0:
      case 3:
      case 4:
        let cancelSubscriptionParams = {
          subscriptionId: subscriptionToCancel.stripe_id,
          params: {
            prorate: this.prorate,
            invoice_now: true,
          },
        };
        let subscriptionCanceled = await stripe.cancelSubscription(cancelSubscriptionParams);
        let localCancellationParams = {
          status: stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status],
        };
        await stripeSubscriptionsModel.edit(localCancellationParams, subscriptionId);
        return subscriptionCanceled;
      default:
        throw new Error('Something wrong');
    }
  };
  this.userAddCard = async function (cardParams) {
    let createdCard = await stripe.createCard(cardParams);

    if (createdCard) {
      if (createdCard.metadata.is_default == '1') {
        let customerUpdateParams = {
          customerId: createdCard.customer,
          params: { default_source: createdCard.id },
        };
        await stripe.updateCustomer(customerUpdateParams);
        let defaultCards = await stripeCardsModel.getAll({ is_default: 1 });
        if (defaultCards.length > 0) {
          defaultCards.forEach(async (card) => {
            await stripeCardsModel.edit({ is_default: 0 }, card.id);
          });
        }
      }
      cardModelEntry = {
        card_last: createdCard.last4 ?? '',
        card_brand: createdCard.brand ?? '',
        card_exp_month: createdCard.exp_month ?? '',
        exp_year: createdCard.exp_year ?? '',
        card_name: createdCard.metadata.card_name ?? '',
        stripe_card_customer: createdCard.customer,
        stripe_card_id: createdCard.id,
        is_default: createdCard.metadata.is_default,
        user_id: this.userId ?? null,
        role_id: this.roleId ?? null,
      };
      var modelCreatedCard = await stripeCardsModel.insert(cardModelEntry);
      if (!modelCreatedCard) {
        throw new Error('Internal error: Error adding card');
      }
    }
    return modelCreatedCard;
  };
  this.changePlan = async function (currentSubscription, newPlan, user, card, couponId = '') {
    //if current subscriptions is canceled
    if (!currentSubscription || currentSubscription.status == 5) {
      let subscriptionParams = {
        customer: user.stripe_id,
        items: { plan: newPlan.id },
        coupon: couponId,
      };
      return await this.subscribe(subscriptionParams, newPlan);
    }
    //user has subscription (upgrade/ downgrade)
    if (currentSubscription && currentSubscription.status != 5) {
      if (currentSubscription.plan_id == newPlan.id) throw new Error('Same Plan');
    }
  };
}
