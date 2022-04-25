require('dotenv').config(); //require .env for stripe configurations
// const moment = require('moment'); //this is Payment Service
const paypal = require('./PaypalApi');
const db = require('../models');
const { update } = require('lodash');
const paypalPlansModel = db.paypal_plans;
const paypalServicesModel = db.paypal_services;
const paypalProductsModel = db.paypal_products;

module.exports = new Service();
function Service() {
  this.userId = 0;
  this.roleId = 0;
  this.currency = process.env.PAYPAL_CURRENCY;
  // this.prorate = process.env.STRIPE_PRORATE;
  // this.forceCancel = process.env.STRIPE_FORCE_CANCEL;

  this.setUserId = function (userId) {
    this.userId = userId;
  };
  this.setRoleId = function (roleId) {
    this.roleId = roleId;
  };
  this.setCurrency = function (currency) {
    this.currency = currency;
  };
  // this.setProrationType = function (prorate) {
  //   this.prorate = prorate;
  // };
  // this.setCancelType = function (forceCancel) {
  //   this.forceCancel = forceCancel;
  // };

  // this.subscribe = async function (subscriptionParams, plan) {
  //   var subscription = await stripe.createSubscription(subscriptionParams);
  //   //create model entry
  //   let subscriptionModelEntry = {
  //     stripe_id: subscription.id ?? '',
  //     cancel_at_period_end: subscription.cancel_at_period_end ?? null,
  //     current_period_start: moment(new Date(subscription.current_period_start * 1000)).format('YYYY-MM-DD') ?? null,
  //     current_period_end: moment(new Date(subscription.current_period_end * 1000)).format('YYYY-MM-DD') ?? null,
  //     user_id: this.userId ?? null,
  //     role_id: this.roleId ?? null,
  //     plan_id: plan?.id ?? null,
  //     coupon_stripe_id: subscription.discount?.coupon?.id ?? '',
  //     customer_stripe_id: subscription.customer ?? '',
  //     collection_method: subscription.collection_method ?? '',
  //     interval: stripeSubscriptionsModel.inverse_interval_mapping(subscription.plan?.interval) ?? 0,
  //     interval_count: subscription.plan?.interval_count ?? '',
  //     trial_period_days: subscription.plan?.trial_period_days ?? 0,
  //     trial_end: subscription.trial_end ? moment(new Date(subscription.trial_end * 1000)).format('YYYY-MM-DD') : null,
  //     trial_start: subscription.trial_start ? moment(new Date(subscription.subscriptiontrial_start * 1000)).format('YYYY-MM-DD') : null,
  //     status: stripeSubscriptionsModel.inverse_status_mapping(subscription.status) ?? null,
  //   };

  //   let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
  //   if (!subscriptionCreatedId) {
  //     throw new Error('Subscription is not found.');
  //   }

  //   let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, subscription.status, plan);
  //   if (!subscriptionLogUpdated) {
  //     throw new Error('Error while editing subscription log');
  //   }
  //   return subscriptionCreatedId;
  // };
  // this.updateSubscriptionLog = async function (subscriptionCreatedId, subscriptionCreatedStatus, plan) {
  //   let subscriptionLog = await stripeSubscriptionsLogModel.getLast({ user_id: this.userId, role_id: this.roleId });

  //   if (!subscriptionLog) {
  //     let subscriptionLogModelEntry = {
  //       user_id: this.userId,
  //       role_id: this.roleId,
  //       plan_id: plan?.id ?? null,
  //       subscription_id: subscriptionCreatedId,
  //       type: plan?.type ?? null,
  //       status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
  //     };
  //     if (!(await stripeSubscriptionsLogModel.insert(subscriptionLogModelEntry))) {
  //       throw new Error('Subscription log add not successfull');
  //     }
  //   } else {
  //     let subscriptionLogModelEntry = {
  //       plan_id: plan?.id ?? null,
  //       subscription_id: subscriptionCreatedId,
  //       type: plan?.type ?? null,
  //       status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
  //     };

  //     if (!(await stripeSubscriptionsLogModel.edit(subscriptionLogModelEntry, subscriptionLog.id))) {
  //       throw new Error('Subscription log edit not successfull');
  //     }
  //   }
  //   return true;
  // };
  // this.createRegularSubscription = async function (user, plan, card, coupon) {
  //   let subscriptionParams = {
  //     customer: user.stripe_id,
  //     items: [{ price: plan.stripe_id }],
  //     trial_from_plan: true,
  //     default_payment_method: card.stripe_card_id,
  //     coupon: coupon?.stripe_id ?? null,
  //   };
  //   return await this.subscribe(subscriptionParams, plan);
  // };
  // this.createLifetimeSubscription = async function (user, plan, card, coupon) {
  //   //create invoice, finalize and pay it.
  //   let lifetimePlanStripeObject = await stripe.retrievePrice(plan.stripe_id);
  //   let invoiceItemParams = {
  //     customer: user.stripe_id,
  //     price: plan.stripe_id,
  //     discounts: [{ coupon: coupon?.stripe_id }],
  //   };
  //   let invoiceItemCreated = await stripe.createInvoiceItem(invoiceItemParams);

  //   let invoiceParams = {
  //     customer: user.stripe_id,
  //     default_payment_method: card?.stripe_card_id ?? null,
  //   };
  //   let invoiceCreated = await stripe.createInvoice(invoiceParams);

  //   let invoicePaid = await stripe.payInvoice(invoiceCreated.id);

  //   let subscriptionModelEntry = {
  //     stripe_id: invoiceItemCreated.id ?? '',
  //     cancel_at_period_end: null,
  //     current_period_start: moment().format('YYYY-MM-DD') ?? null,
  //     current_period_end: null,
  //     user_id: this.userId ?? null,
  //     role_id: this.roleId ?? null,
  //     plan_id: plan?.id ?? null,
  //     coupon_stripe_id: invoiceItemCreated.discounts.length > 0 ? coupon?.stripe_id : '',
  //     customer_stripe_id: invoicePaid.customer ?? '',
  //     collection_method: invoicePaid.collection_method ?? '',
  //     interval: 4,
  //     interval_count: null,
  //     trial_period_days: 0,
  //     trial_end: null,
  //     trial_start: null,
  //     status: 4,
  //   };

  //   let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
  //   if (!subscriptionCreatedId) {
  //     throw new Error('Subscription is not found.');
  //   }

  //   let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, 'active', plan);
  //   if (!subscriptionLogUpdated) {
  //     throw new Error('Error while editing subscription log');
  //   }

  //   return subscriptionCreatedId;
  // };
  // let calculateFullPeriod = function (interval, interval_count = 1) {
  //   let totalNumberOfDays = paypalPlansModel.interval_days_mapping()[interval] * interval_count;
  //   let cancelAtEpoch = moment().add(totalNumberOfDays, 'days').unix();
  //   return cancelAtEpoch;
  // };
  // this.createTrialSubscription = async function (user, plan, card, coupon) {
  //   let trialPlanFullPeriod = calculateFullPeriod(plan.interval, plan.interval_count);
  //   let subscriptionParams = {
  //     customer: user.stripe_id,
  //     items: [{ price: plan.stripe_id }],
  //     trial_from_plan: true,
  //     default_payment_method: card.stripe_card_id,
  //     coupon: coupon?.stripe_id ?? null,
  //     cancel_at: trialPlanFullPeriod,
  //   };
  //   return await this.subscribe(subscriptionParams, plan);
  // };
  // this.cancelRegularSubscription = async function (subscription) {
  //   if (this.forceCancel === 'true') {
  //     var cancellationParams = {
  //       subscriptionId: subscription.stripe_id,
  //       params: {
  //         invoice_now: true,
  //         prorate: this.prorate,
  //       },
  //     };
  //     let subscriptionCanceled = await stripe.cancelSubscription(cancellationParams);

  //     let newStatus = stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status];
  //     await stripeSubscriptionsModel.edit({ status: newStatus }, subscription.id);
  //   } else {
  //     let updateParams = {
  //       subscriptionId: subscription.stripe_id,
  //       params: {
  //         cancel_at_period_end: true,
  //       },
  //     };
  //     await stripe.updateSubscription(updateParams);
  //     await stripeSubscriptionsModel.edit({ cancel_at_period_end: 1 }, subscription.id);
  //   }
  // };
  // this.cancelLifetimeSubscription = async function (subscription) {
  //   //TODO check if we refund on this or not
  //   //we could make a fixed refund amount
  //   //right now we just cancel it locally and refund is never as it is a onetime product thing.
  //   let subscriptionEdited = await stripeSubscriptionsModel.edit({ status: 5 }, parseInt(subscription.id));
  //   if (!subscriptionEdited) {
  //     throw new Error("Couldn't edit subscription");
  //   }
  //   let subscriptionLog = await stripeSubscriptionsLogModel.getByFields({ subscription_id: parseInt(subscription.id), status: 1 });
  //   if (!subscriptionLog) {
  //     throw new Error("Couldn't find relative active subscription log");
  //   }
  //   let subscriptionLogEdited = await stripeSubscriptionsLogModel.edit({ status: 0 }, subscriptionLog.id);
  //   if (subscriptionLogEdited) {
  //     return true;
  //   }
  //   throw new Error("Couldn't Edit subscription log");
  // };

  // this.adminCreateProductPrice = async function (productStripeId, price, productLocalId) {
  //   let priceArgs = {
  //     unit_amount: convertToCents(price),
  //     currency: this.currency,
  //     product: productStripeId,
  //   };
  //   let priceCreated = await stripe.createPrice(priceArgs);

  //   let productModelEditEntry = {
  //     price,
  //     price_stripe_id: priceCreated.id,
  //   };
  //   let modelEditedProduct = await stripeProductsModel.edit(productModelEditEntry, productLocalId);
  //   if (!modelEditedProduct) {
  //     throw new Error('Internal Error: error setting price');
  //   }
  //   return priceCreated;
  // };

  this._createPaypalProduct = async function (params) {
    let productParams = {
      name: params.name,
      description: params.description,
      type: params.type,
      category: params.category,
      image_url: params.image,
      home_url: params.url,
    };
    return await paypal.createProduct(productParams);
  };
  this.adminUpdateProduct = async function (category, paypalId) {
    await paypal.setAccessToken();
    let updateParams = [
      {
        op: 'replace',
        path: '/category',
        value: category,
      },
    ];
    await paypal.updateProduct(updateParams, paypalId);
    return true;
  };

  this.adminCreateProduct = async function (params, type) {
    if (!params.name) {
      throw new Error('Must provide a name for your product');
    }
    if (!params.type) {
      throw new Error('Must provide a type for your product');
    }

    await paypal.setAccessToken();

    let createdPaypalProduct = await this._createPaypalProduct(params);

    let paypalProductModelEntry = {
      name: createdPaypalProduct.data.name,
      paypal_id: createdPaypalProduct.data.id,
      image: createdPaypalProduct.data.image_url ?? '',
      type: createdPaypalProduct.data.type ?? '',
      url: createdPaypalProduct.data.home_url ?? '',
      category: createdPaypalProduct.data.category ?? '',
      description: createdPaypalProduct.data.description ?? '',
      status: params.status,
    };

    switch (params.type) {
      case 'SERVICE': {
        var modelCreatedProductId = await paypalServicesModel.insert(paypalProductModelEntry);
        var product = await paypalServicesModel.getByPK(modelCreatedProductId);
        break;
      }
      case 'PHYSICAL':
      case 'DIGITAL': {
        var modelCreatedProductId = await paypalProductsModel.insert(paypalProductModelEntry);
        var product = await paypalProductsModel.getByPK(modelCreatedProductId);
        break;
      }
    }
    if (!modelCreatedProductId) {
      throw new Error('Internal Error: Error adding product to our system');
    }

    return {
      productPaypalId: product.paypal_id,
      productLocalId: product.id,
    };
  };

  /**
   * [adminCreateRegularPlan       allows an admin to create subscription plan through admin portal]
   * @param  {object}   planParams      [object that contain plan parameters]
   * @param  {integer}  planType        [integer that represent plan type in relative to stripe plans table] @see /models/stripe_plans.js type_mapping()
   * @param  {integer}  localProductId  [integer that represent product id in relative to stripe products table]
   * @return {integer}                  [the id of the created plan in database]
   */
  this.adminCreateRegularPlan = async function (params) {
    if (!params.name) {
      throw new Error('Must have a display name');
    }
    if (!params.type) {
      throw new Error('Must provide plan type');
    }
    if (!params.service_id) {
      throw new Error('Must attach a service');
    }
    await paypal.setAccessToken();
    let service = await paypalServicesModel.getByPK(params.service_id);

    let paypalSubscriptionPlanParams = {
      product_id: service.paypal_id,
      name: params.name,
      billing_cycles: [
        {
          frequency: {
            interval_unit: paypalPlansModel.interval_unit_mapping()[params.interval_unit].toUpperCase(),
            interval_count: params.interval_count,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: params.pricing,
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

    let paypalPlanCreated = await paypal.createPlan(paypalSubscriptionPlanParams);

    let hasTrial = paypalPlanCreated.data.billing_cycles[1] ? true : false;
    let trialPlanInfo = hasTrial ? paypalPlanCreated.data.billing_cycles[0] : null;
    let regularPlanInfo = hasTrial ? paypalPlanCreated.data.billing_cycles[1] : paypalPlanCreated.data.billing_cycles[0];
    let price = regularPlanInfo.pricing_scheme.fixed_price.value;
    let interval_unit = regularPlanInfo.frequency.interval_unit;
    let interval_count = regularPlanInfo.frequency.interval_count;

    let planModelEntry = {
      name: paypalPlanCreated.data.name,
      type: params.type,
      paypal_id: paypalPlanCreated.data.id,
      description: paypalPlanCreated.data.description,
      paypal_product_id: paypalPlanCreated.data.product_id,
      pricing: price,
      interval_unit: this.getMappingKey(paypalPlansModel.interval_unit_mapping, interval_unit.toLowerCase()),
      interval_count: interval_count,
      service_id: params.service_id,
      trial_period_days: trialPlanInfo ? trialPlanInfo.frequency.interval_count : 0,
      status: this.getMappingKey(paypalPlansModel.status_mapping, paypalPlanCreated.data.status),
    };

    let modelCreatedPlan = await paypalPlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this.updateRegularPlan = async function (params, currentSettings) {
    //if plan has a trial
    await paypal.setAccessToken();
    let planPaypalId = currentSettings.paypal_id;

    if (currentSettings.status == 0 && params.status == 1) {
      await paypal.activatePlan(planPaypalId);
    } else if (currentSettings.status == 1 && params.status == 0) {
      await this._destroyPaypalPlan(planPaypalId);
      return { status: 0 };
    } else if (currentSettings.status == 0 && params.status == 0) {
      throw new Error("Can't edit a plan if it is inactive");
    }

    let regularPlanIndex = currentSettings.trial_period_days ? 2 : 1;

    let updateParams = [
      {
        op: 'replace',
        path: '/name',
        value: params.name,
      },
    ];

    await paypal.updatePlan(updateParams, planPaypalId);

    updateParams = {
      pricing_schemes: [
        {
          billing_cycle_sequence: regularPlanIndex,
          pricing_scheme: {
            fixed_price: {
              value: params.pricing,
              currency_code: this.currency.toUpperCase(),
            },
          },
        },
      ],
    };

    await paypal.updatePlanPricing(updateParams, planPaypalId);

    return { name: params.name, pricing: params.pricing, status: params.status };
  };

  this.adminCreateLifetimePlan = async function (params) {
    //paypal doesn't allow lifetime plan
    //how it works is i create a blan with a trial with 999 years and setup fee for subscription as the main amount for the lifetime plan
    //paypal needs to have a regular plan so after the 999 years there is a regular plan with 0.01 amount money
    //this works for both lifetime paid and free plans.

    if (!params.name) {
      throw new Error('Must have a display name');
    }
    if (!params.type) {
      throw new Error('Must provide plan type');
    }
    if (!params.service_id) {
      throw new Error('Must attach a service');
    }
    if (parseInt(params.interval_unit) !== 4) {
      throw new Error('Interval must be "forever".');
    }

    let service = await paypalServicesModel.getByPK(params.service_id);

    await paypal.setAccessToken();

    let planParams = {
      product_id: service.paypal_id,
      name: params.name,
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
          value: params.pricing,
          currency_code: this.currency.toUpperCase(),
        },
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 0,
      },
    };
    let paypalPlanCreated = await paypal.createPlan(planParams);

    let price = paypalPlanCreated.data.payment_preferences.setup_fee.value;

    let planModelEntry = {
      name: paypalPlanCreated.data.name,
      type: params.type,
      paypal_id: paypalPlanCreated.data.id,
      description: paypalPlanCreated.data.description,
      paypal_product_id: paypalPlanCreated.data.product_id,
      pricing: price,
      interval_unit: 4,
      interval_count: null,
      service_id: params.service_id,
      trial_period_days: null,
      status: this.getMappingKey(paypalPlansModel.status_mapping, paypalPlanCreated.data.status),
    };

    let modelCreatedPlan = await paypalPlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this.adminCreateTrialPlan = async function (params) {
    if (!params.name) {
      throw new Error('Must have a display name');
    }
    if (!params.type) {
      throw new Error('Must provide plan type');
    }
    if (!params.service_id) {
      throw new Error('Must attach a service');
    }
    if (parseInt(params.interval_unit) === 4) {
      throw new Error('Interval can\'t be "forever".');
    }
    let service = await paypalServicesModel.getByPK(params.service_id);

    await paypal.setAccessToken();

    let planParams = {
      product_id: service.paypal_id,
      name: params.name,
      billing_cycles: [
        // {
        //   frequency: {
        //     interval_unit: 'YEAR',
        //     interval_count: 1,
        //   },
        //   tenure_type: 'TRIAL',
        //   sequence: 1,
        //   total_cycles: 999,
        // },
        {
          frequency: {
            interval_unit: paypalPlansModel.interval_unit_mapping()[params.interval_unit].toUpperCase(),
            interval_count: params.interval_count,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: {
              value: params.pricing,
              currency_code: this.currency.toUpperCase(),
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        // setup_fee: {
        //   value: params.pricing,
        //   currency_code: this.currency.toUpperCase(),
        // },
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 0,
      },
    };
    let paypalPlanCreated = await paypal.createPlan(planParams);

    let planInfo = paypalPlanCreated.data.billing_cycles[0];
    let price = planInfo.pricing_scheme.fixed_price.value;
    let interval_unit = planInfo.frequency.interval_unit;
    let interval_count = planInfo.frequency.interval_count;

    let planModelEntry = {
      name: paypalPlanCreated.data.name,
      type: params.type,
      paypal_id: paypalPlanCreated.data.id,
      description: paypalPlanCreated.data.description,
      paypal_product_id: paypalPlanCreated.data.product_id,
      pricing: price,
      interval_unit: this.getMappingKey(paypalPlansModel.interval_unit_mapping, interval_unit.toLowerCase()),
      interval_count: interval_count,
      service_id: params.service_id,
      trial_period_days: 0,
      status: this.getMappingKey(paypalPlansModel.status_mapping, paypalPlanCreated.data.status),
    };

    let modelCreatedPlan = await paypalPlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this._destroyStripeLifetimePlan = async function (planStripeId) {
    //stripe doesn't allow deleting a price. will be set to unactive instead
    return await stripe.updatePrice({ priceId: planStripeId, params: { active: false } });
  };
  this._destroyPaypalPlan = async function (planPaypalId) {
    //paypal doesn't allow deleting a price. will be set to unactive instead
    return await paypal.deactivatePlan(planPaypalId);
  };

  // this.adminCancelSubscription = async function (subscriptionId) {
  //   let subscriptionToCancel = await stripeSubscriptionsModel.getByPK(subscriptionId);
  //   let subscriptionPlan = await paypalPlansModel.getByPK(subscriptionToCancel.plan_id);
  //   if (!subscriptionToCancel || !subscriptionPlan) {
  //     throw new Error('No subscription or plan of that id');
  //   }
  //   // let subscirptionType = subscriptionPlan.type;
  //   let subscirptionType = 3;
  //   //if normal subscription
  //   switch (subscirptionType) {
  //     case 0:
  //     case 3:
  //     case 4:
  //       let cancelSubscriptionParams = {
  //         subscriptionId: subscriptionToCancel.stripe_id,
  //         params: {
  //           prorate: this.prorate,
  //           invoice_now: true,
  //         },
  //       };
  //       let subscriptionCanceled = await stripe.cancelSubscription(cancelSubscriptionParams);
  //       let localCancellationParams = {
  //         status: stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status],
  //       };
  //       await stripeSubscriptionsModel.edit(localCancellationParams, subscriptionId);
  //       return subscriptionCanceled;
  //     default:
  //       throw new Error('Something wrong');
  //   }
  // };
  // this.userAddCard = async function (cardParams) {
  //   let createdCard = await stripe.createCard(cardParams);

  //   if (createdCard) {
  //     if (createdCard.metadata.is_default == '1') {
  //       let customerUpdateParams = {
  //         customerId: createdCard.customer,
  //         params: { default_source: createdCard.id },
  //       };
  //       await stripe.updateCustomer(customerUpdateParams);
  //       let defaultCards = await stripeCardsModel.getAll({ is_default: 1 });
  //       if (defaultCards.length > 0) {
  //         defaultCards.forEach(async (card) => {
  //           await stripeCardsModel.edit({ is_default: 0 }, card.id);
  //         });
  //       }
  //     }
  //     cardModelEntry = {
  //       card_last: createdCard.last4 ?? '',
  //       card_brand: createdCard.brand ?? '',
  //       card_exp_month: createdCard.exp_month ?? '',
  //       exp_year: createdCard.exp_year ?? '',
  //       card_name: createdCard.metadata.card_name ?? '',
  //       stripe_card_customer: createdCard.customer,
  //       stripe_card_id: createdCard.id,
  //       is_default: createdCard.metadata.is_default,
  //       user_id: this.userId ?? null,
  //       role_id: this.roleId ?? null,
  //     };
  //     var modelCreatedCard = await stripeCardsModel.insert(cardModelEntry);
  //     if (!modelCreatedCard) {
  //       throw new Error('Internal error: Error adding card');
  //     }
  //   }
  //   return modelCreatedCard;
  // };
  // this.changePlan = async function (currentSubscription, newPlan, user, card, couponId = '') {
  //   //if current subscriptions is canceled
  //   if (!currentSubscription || currentSubscription.status == 5) {
  //     let subscriptionParams = {
  //       customer: user.stripe_id,
  //       items: { plan: newPlan.id },
  //       coupon: couponId,
  //     };
  //     return await this.subscribe(subscriptionParams, newPlan);
  //   }
  //   //user has subscription (upgrade/ downgrade)
  //   if (currentSubscription && currentSubscription.status != 5) {
  //     if (currentSubscription.plan_id == newPlan.id) throw new Error('Same Plan');
  //   }
  // };
  this.getMappingKey = function (mappingFunction, value) {
    return Object.keys(mappingFunction()).find((key) => mappingFunction()[key] === value);
  };
}
