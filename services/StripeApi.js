const Stripe = require('stripe');
module.exports = new Service();
function Service() {
  this.apiSecretKey = process.env.STRIPE_SECRET_KEY;
  this.apiPublishKey = process.env.STRIPE_PUBLISH_KEY;
  this.stripe = Stripe(this.apiSecretKey);

  // Products Functions
  this.createProduct = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'product_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrieveProduct = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'product_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.listAllProducts = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'product_list_all';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.updateProduct = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'product_update';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  //  Cards Functions
  this.createCard = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'card_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  // Customers Functions
  this.createCustomer = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'customer_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.updateCustomer = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'customer_update';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrieveCustomer = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'customer_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.listAllCustomers = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'customer_list_all';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  // Card Functions
  this.retrieveCard = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'card_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  // Prices Functions
  this.createPrice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'price_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.updatePrice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'price_update';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrievePrice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'price_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.listAllPrices = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'price_list_all';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  // Charges Functions
  this.createCharge = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'charge_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrieveCharge = async function (params) {
    // args = params;
    args = this.filterParams(params);
    let stripeType = 'charge_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  //Invoices Functions
  this.createInvoice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'invoice_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.payInvoice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'invoice_pay';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrieveInvoice = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'invoice_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.createInvoiceItem = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'invoice_item_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  //subscriptions
  this.createSubscription = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'subscription_create';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.updateSubscription = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'subscription_update';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.retrieveSubscription = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'subscription_retrieve';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.cancelSubscription = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'subscription_cancel';
    var result = await this.stripeType(stripeType, args);
    return result;
  };
  this.listAllSubscriptions = async function (params) {
    args = this.filterParams(params);
    let stripeType = 'subscription_list_all';
    var result = await this.stripeType(stripeType, args);
    return result;
  };

  this.stripeType = async function (type, args) {
    try {
      switch (type) {
        //Products
        case 'product_create':
          // @see https://stripe.com/docs/api/products/create?lang=node
          var result = await this.stripe.products.create(args);
          break;
        case 'product_delete':
          // @see https://stripe.com/docs/api/products/delete?lang=node
          var result = await this.stripe.products.del(args);
          break;
        case 'product_retrieve':
          // @see https://stripe.com/docs/api/products/retrieve?lang=node
          var result = await this.stripe.products.retrieve(args);
          break;
        case 'product_update':
          // @see https://stripe.com/docs/api/products/update?lang=node
          var result = await this.stripe.products.update(args.productId, args.params);
          break;
        case 'product_list_all':
          // @see https://stripe.com/docs/api/products/list?lang=node
          var result = await this.stripe.products.list(args);
          break;

        //Prices
        case 'price_create':
          // @see https://stripe.com/docs/api/prices/create?lang=node
          var result = await this.stripe.prices.create(args);
          break;
        case 'price_retrieve':
          // @see https://stripe.com/docs/api/prices/retrieve?lang=node
          var result = await this.stripe.prices.retrieve(args);
          break;
        case 'price_update':
          // @see https://stripe.com/docs/api/prices/update?lang=node
          var result = await this.stripe.prices.update(args.priceId, args.params);
          break;
        case 'price_list_all':
          // @see https://stripe.com/docs/api/prices/list?lang=node
          var result = await this.stripe.prices.list(args);
          break;

        //Charges
        case 'charge_create':
          // @see https://stripe.com/docs/api/charges/create?lang=node
          var result = await this.stripe.charges.create(args);
          break;
        case 'charge_retrieve':
          // @see https://stripe.com/docs/api/charges/retrieve?lang=node
          var result = await this.stripe.charges.retrieve(args);
          break;
        case 'charge_update':
          // @see https://stripe.com/docs/api/charges/update?lang=node
          var result = await this.stripe.charges.update(args.chargeId, args.params);
          break;
        case 'charge_capture':
          // @see https://stripe.com/docs/api/charges/capture?lang=node
          var result = await this.stripe.charges.capture(args);
          break;
        case 'charge_list_all':
          // @see https://stripe.com/docs/api/charges/list?lang=node
          var result = await this.stripe.charges.list(args);
          break;

        //Customer
        case 'customer_create':
          // @see https://stripe.com/docs/api/customers/create?lang=node
          var result = await this.stripe.customers.create(args);
          break;
        case 'customer_retrieve':
          // @see https://stripe.com/docs/api/customers/retrieve?lang=node
          var result = await this.stripe.customers.retrieve(args);
          break;
        case 'customer_update':
          // @see https://stripe.com/docs/api/customers/update?lang=node
          var result = await this.stripe.customers.update(args.customerId, args.params);
          break;
        case 'customer_delete':
          // @see https://stripe.com/docs/api/customers/capture?lang=node
          var result = await this.stripe.customers.del(args);
          break;
        case 'customer_list_all':
          // @see https://stripe.com/docs/api/customers/list?lang=node
          var result = await this.stripe.customers.list(args);
          break;

        //Refunds
        case 'refund_create':
          // @see https://stripe.com/docs/api/refunds/create?lang=node
          var result = await this.stripe.refunds.create(args);
          break;
        case 'refund_retrieve':
          // @see https://stripe.com/docs/api/refunds/retrieve?lang=node
          var result = await this.stripe.refunds.retrieve(args);
          break;
        case 'refund_update':
          // @see https://stripe.com/docs/api/refunds/update?lang=node
          var result = await this.stripe.refunds.update(args.refundId, args.params);
          break;
        case 'refund_list_all':
          // @see https://stripe.com/docs/api/refunds/list?lang=node
          var result = await this.stripe.refunds.list(args);
          break;

        //Cards (Sources)
        case 'card_create':
          // @see https://stripe.com/docs/api/cards/create?lang=node
          var result = await this.stripe.customers.createSource(args.customerId, args.params);
          break;
        case 'card_retrieve':
          // @see https://stripe.com/docs/api/cards/retrieve?lang=node
          var result = await this.stripe.customers.retrieveSource(args.customerId, args.cardId);
          break;
        case 'card_update':
          // @see https://stripe.com/docs/api/cards/update?lang=node
          var result = await this.stripe.customers.updateSource(args.customerId, args.cardId, args.params);
          break;
        case 'card_delete':
          // @see https://stripe.com/docs/api/cards/delete?lang=node
          var result = await this.stripe.customers.deleteSource(args.customerId, args.cardId);
          break;
        case 'card_list_all':
          // @see https://stripe.com/docs/api/cards/list?lang=node
          var result = await this.stripe.customers.listSources(args.customerId, args.params);
          break;

        //Payment Method
        case 'paymentMethod_create':
          // @see https://stripe.com/docs/api/payment_methods/create?lang=node
          var result = await this.stripe.paymentMethods.create(args);
          break;
        case 'paymentMethod_retrieve':
          // @see https://stripe.com/docs/api/payment_methods/retrieve?lang=node
          var result = await this.stripe.paymentMethods.retrieve(args);
          break;
        case 'paymentMethod_update':
          // @see https://stripe.com/docs/api/payment_methods/update?lang=node
          var result = await this.stripe.paymentMethods.update(args.paymentMethodId, args.params);
          break;
        case 'paymentMethod_attach':
          // @see https://stripe.com/docs/api/payment_methods/attach?lang=node
          var result = await this.stripe.paymentMethods.attach(args.paymentMethodId, args.params);
          break;
        case 'paymentMethod_detach':
          // @see https://stripe.com/docs/api/payment_methods/attach?lang=node
          var result = await this.stripe.paymentMethods.attach(args);
          break;
        case 'paymentMethod_list_all':
          // @see https://stripe.com/docs/api/payment_methods/list?lang=node
          var result = await this.stripe.paymentMethods.list(args);
          break;

        //Session
        case 'session_create':
          // @see https://stripe.com/docs/api/sessions/create?lang=node
          var result = await this.stripe.checkout.sessions.create(args);
          break;
        case 'session_retrieve':
          // @see https://stripe.com/docs/api/sessions/retrieve?lang=node
          var result = await this.stripe.checkout.sessions.retrieve(args);
          break;
        case 'session_list_all_lineItems':
          // @see https://stripe.com/docs/api/sessions/line_items?lang=node
          var result = function () {
            return new Promise((resolve, reject) => {
              this.stripe.checkout.sessions.listLineItems(args.sessionId, args.params, function (err, lineItems) {
                if (err) return reject(err);
                return resolve(lineItems);
              });
            });
          };
          result = await result();
          break;
        case 'session_list_all':
          // @see https://stripe.com/docs/api/session/list?lang=node
          var result = await this.stripe.checkout.sessions.list(args);
          break;

        //Coupon
        case 'coupon_create':
          // @see https://stripe.com/docs/api/coupons/create?lang=node
          var result = await this.stripe.coupons.create(args);
          break;
        case 'coupon_retrieve':
          // @see https://stripe.com/docs/api/coupons/retrieve?lang=node
          var result = await this.stripe.coupons.retrieve(args);
          break;
        case 'coupon_update':
          // @see https://stripe.com/docs/api/coupons/update?lang=node
          var result = await this.stripe.coupons.update(args.couponId, args.params);
          break;
        case 'coupon_delete':
          // @see https://stripe.com/docs/api/coupons/delete?lang=node
          var result = await this.stripe.coupons.del(args);
          break;
        case 'coupon_list_all':
          // @see https://stripe.com/docs/api/coupons/list?lang=node
          var result = await this.stripe.coupons.list(args);
          break;

        //Invoice items
        case 'invoice_item_create':
          // @see https://stripe.com/docs/api/invoiceitems/create?lang=node
          var result = await this.stripe.invoiceItems.create(args);
          break;

        //Invoice
        case 'invoice_create':
          // @see https://stripe.com/docs/api/invoices/create?lang=node
          var result = await this.stripe.invoices.create(args);
          break;
        case 'invoice_retrieve':
          // @see https://stripe.com/docs/api/invoices/retrieve?lang=node
          var result = await this.stripe.invoices.retrieve(args);
          break;
        case 'invoice_update':
          // @see https://stripe.com/docs/api/invoices/update?lang=node
          var result = await this.stripe.invoices.update(args.invoiceId, args.params);
          break;
        case 'invoice_delete':
          // @see https://stripe.com/docs/api/invoices/delete?lang=node
          var result = await this.stripe.invoices.del(args);
          break;
        case 'invoice_finalize':
          // @see https://stripe.com/docs/api/invoices/finalize?lang=node
          var result = await this.stripe.invoices.finalizeInvoice(args);
          break;
        case 'invoice_pay':
          // @see https://stripe.com/docs/api/invoices/pay?lang=node
          var result = await this.stripe.invoices.pay(args);
          break;
        case 'invoice_void':
          // @see https://stripe.com/docs/api/invoices/void?lang=node
          var result = await this.stripe.invoices.voidInvoice(args);
          break;
        case 'invoice_list_all':
          // @see https://stripe.com/docs/api/invoices/list?lang=node
          var result = await this.stripe.invoices.list(args);
          break;

        //Subscription
        case 'subscription_create':
          // @see https://stripe.com/docs/api/subscriptions/create?lang=node
          var result = await this.stripe.subscriptions.create(args);
          break;
        case 'subscription_retrieve':
          // @see https://stripe.com/docs/api/subscriptions/retrieve?lang=node
          var result = await this.stripe.subscriptions.retrieve(args);
          break;
        case 'subscription_update':
          // @see https://stripe.com/docs/api/subscriptions/update?lang=node
          var result = await this.stripe.subscriptions.update(args.subscriptionId, args.params);
          break;
        case 'subscription_cancel':
          // @see https://stripe.com/docs/api/subscriptions/cancel?lang=node
          var result = await this.stripe.subscriptions.del(args.subscriptionId, args.params);
          break;
        case 'subscription_list_all':
          // @see https://stripe.com/docs/api/subscriptions/list?lang=node
          var result = await this.stripe.subscriptions.list(args);
          break;

        //Subscription schedule
        case 'subscription_schedule_create':
          // @see https://stripe.com/docs/api/subscription_schedules/create?lang=node
          var result = await this.stripe.subscriptionSchedules.create(args);
          break;
        case 'subscription_schedule_retrieve':
          // @see https://stripe.com/docs/api/subscription_schedules/retrieve?lang=node
          var result = await this.stripe.subscriptionSchedules.retrieve(args);
          break;
        case 'subscription_schedule_update':
          // @see https://stripe.com/docs/api/subscription_schedules/update?lang=node
          var result = await this.stripe.subscriptionSchedules.update(args.subScheduleId, args.params);
          break;
        case 'subscription_schedule_cancel':
          // @see https://stripe.com/docs/api/subscription_schedules/cancel?lang=node
          var result = await this.stripe.subscriptionSchedules.cancel(args);
          break;
        case 'subscription_schedule_release':
          // @see https://stripe.com/docs/api/subscription_schedules/release?lang=node
          var result = await this.stripe.subscriptionSchedules.release(args);
          break;
        case 'subscription_schedule_list_all':
          // @see https://stripe.com/docs/api/subscription_schedules/list?lang=node
          var result = await this.stripe.subscriptionSchedules.list(args);
          break;

        //Transaction
        case 'transaction_retrieve':
          // @see https://stripe.com/docs/api/issuing/transactions/retrieve?lang=node
          var result = await this.stripe.issuing.transactions.retrieve(args);
          break;
        case 'transaction_update':
          // @see https://stripe.com/docs/api/issuing/transactions/update?lang=node
          var result = await this.stripe.issuing.transactions.update(args.transactionId, args.params);
          break;
        case 'transaction_list_all':
          // @see https://stripe.com/docs/api/issuing/transactions/list?lang=node
          var result = await this.stripe.issuing.transactions.list(args);
          break;

        //Order
        case 'order_create':
          // @see https://stripe.com/docs/api/orders/create?lang=node
          var result = await this.stripe.orders.create(args);
          break;
        case 'order_retrieve':
          // @see https://stripe.com/docs/api/orders/retrieve?lang=node
          var result = await this.stripe.orders.retrieve(args);
          break;
        case 'order_update':
          // @see https://stripe.com/docs/api/orders/update?lang=node
          var result = await this.stripe.orders.update(args.orderId, args.params);
          break;
        case 'order_pay':
          // @see https://stripe.com/docs/api/orders/pay?lang=node
          var result = await this.stripe.orders.pay(args.orderId, args.params);
          break;
        case 'order_list_all':
          // @see https://stripe.com/docs/api/orders/list?lang=node
          var result = await this.stripe.orders.list(args);
          break;
        case 'order_return':
          // @see https://stripe.com/docs/api/orders/return?lang=node
          var result = function () {
            return new Promise((resolve, reject) => {
              this.stripe.orders.returnOrder(args.orderId, args.params, function (err, order) {
                if (err) return reject(err);
                return resolve(order);
              });
            });
          };
          result = await result();
          break;

        //Webhooks
        case 'webhook_create':
          // @see https://stripe.com/docs/api/webhook_endpoints/create?lang=node
          var result = await this.stripe.webhookEndpoints.create(args);
          break;
        case 'webhook_retrieve':
          // @see https://stripe.com/docs/api/webhook_endpoints/retrieve?lang=node
          var result = await this.stripe.webhookEndpoints.retrieve(args);
          break;
        case 'webhook_update':
          // @see https://stripe.com/docs/api/webhook_endpoints/update?lang=node
          var result = await this.stripe.webhookEndpoints.update(args.webhookId, args.params);
          break;
        case 'webhook_delete':
          // @see https://stripe.com/docs/api/webhook_endpoints/delete?lang=node
          var result = await this.stripe.webhookEndpoints.del(args);
          break;
        case 'webhook_list_all':
          // @see https://stripe.com/docs/api/webhook_endpoints/list?lang=node
          var result = await this.stripe.webhookEndpoints.list(args);
          break;
      }
      return result;
    } catch (error) {
      // return { error: true, message: error.message, statusCode: error.statusCode, errorObject: error.raw };
      console.dir(error, { depth: null });
      throw new Error('Internal Error: error when doing stripe action');
    }
  };

  /**
   * [filterParams filters paramters from null, undefined, empty strings, empty arrays and empty objects as it can cause unwanted changes]
   * @param  {object} params  [object that can contain one more object inside]
   * @return {object}         [object with only truth variables]
   */
  this.filterParams = function (params) {
    Object.keys(params).forEach((param) => {
      if (this.empty(params[param]) || (Array.isArray(params[param]) && !params[param].length)) {
        console.log(`Parameter empty, null or undefined`);
        delete params[param];
      } else if (params[param].constructor === Object && Object.entries(params[param]).length === 0) {
        console.log(`Parameter object empty`);
        delete params[param];
      } else if (params[param].constructor === Object && Object.entries(params[param]).length > 0) {
        this.filterParams(params[param]);
      }
    });
    return params;
  };
  // this.empty = (value) => value === null || value === undefined || value === '';
  this.empty = (value) => value === null || value === undefined;
}
