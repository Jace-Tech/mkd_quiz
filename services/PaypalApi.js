require('dotenv').config();

const qs = require('qs'); //parse url form encoded params
const paypalBaseUrl = process.env.PAYPAL_BASE_URL;
const paypalSandboxBaseUrl = process.env.PAYPAL_SANDBOX_BASE_URL;

if (process.env.MODE === 'development') {
  var axios = require('axios').create({
    baseURL: paypalSandboxBaseUrl,
  });
} else if (process.env.MODE === 'production') {
  var axios = require('axios').create({
    baseURL: paypalBaseUrl,
  });
}
let accessToken = '';

module.exports = new Service();
function Service() {
  // this.error = async function () {
  //   Error.call(this);

  // };
  this.setAccessToken = async function () {
    accessToken = await this._getPaypalAccessToken().catch((error) => {
      throw error;
    });
    return accessToken;
  };
  this._getPaypalAccessToken = async function () {
    let data = await axios({
      method: 'post',
      url: '/v1/oauth2/token',
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
    }).catch((error) => {
      throw error;
    });
    return data.data.access_token;
  };
  this.createProduct = async function (params) {
    let requiredFields = ['name', 'type'];
    requiredFields.forEach((field) => {
      if (!params[field]) {
        throw new Error(`Must have "${field}" parameter`);
      }
    });
    params = this.filterParams(params);
    let config = {
      url: '/v1/catalogs/products',
      data: params,
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response, { depth: null });
      throw new Error(error.response?.data?.message ?? 'Internal Error: Error creating product');
    }
  };
  this.getPlans = async function (paginationParams) {
    let config = {
      url: '/v1/billing/plans',
      data: paginationParams,
    };
    try {
      return await this.axiosGet(config);
    } catch (error) {
      console.error(error.response);
      throw new Error('Internal Error: Error getting plans');
    }
  };
  this.getProducts = async function (paginationParams) {
    let config = {
      url: '/v1/catalogs/products',
      data: paginationParams,
    };
    try {
      return await this.axiosGet(config);
    } catch (error) {
      console.error(error.response);
      throw new Error('Internal Error: Error getting products');
    }
  };
  this.getProductDetails = async function (productId) {
    let config = {
      url: `/v1/catalogs/products/${productId}`,
      data: {},
    };
    try {
      return await this.axiosGet(config);
    } catch (error) {
      console.error(error.response);
      throw new Error('Internal Error: Error getting product details');
    }
  };

  this.getSubscriptions = async function (paginationParams) {
    let createdProduct = await axios({
      method: 'get',
      url: '/v1/billing/plans',
      data: qs.stringify(paginationParams),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      throw error;
    });
    return createdProduct.data;
  };
  this.createSubscription = async function (params) {
    let config = {
      url: '/v1/billing/subscriptions',
      data: params,
    };
    return await this.axiosPost(config);
  };
  this.createPlan = async function (params) {
    let config = {
      url: '/v1/billing/plans',
      data: params,
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error creating paypal subscription plan');
    }
  };
  this.deactivatePlan = async function (planId) {
    let config = {
      url: `/v1/billing/plans/${planId}/deactivate`,
      data: {},
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error deactivating paypal subscription plan');
    }
  };
  this.getPlanDetails = async function (planId) {
    let config = {
      url: `/v1/billing/plans/${planId}`,
      data: {},
    };
    try {
      return await this.axiosGet(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error getting subscription details');
    }
  };
  this.getSubscriptionDetails = async function (subscriptionId) {
    let config = {
      url: `/v1/billing/subscriptions/${subscriptionId}`,
      data: {},
    };
    try {
      return await this.axiosGet(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error getting subscription details');
    }
  };
  this.updateProduct = async function (params, productId) {
    let config = {
      url: `/v1/catalogs/products/${productId}`,
      data: params,
    };
    try {
      return await this.axiosPatch(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error updating product');
    }
  };
  this.updatePlan = async function (params, planId) {
    let config = {
      url: `/v1/billing/plans/${planId}`,
      data: params,
    };
    try {
      return await this.axiosPatch(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error updating plan');
    }
  };
  this.updatePlanPricing = async function (params, planId) {
    let config = {
      url: `/v1/billing/plans/${planId}/update-pricing-schemes`,
      data: params,
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error updating plan');
    }
  };
  this.activatePlan = async function (planId) {
    let config = {
      url: `/v1/billing/plans/${planId}/activate`,
      data: {},
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error updating plan');
    }
  };
  this.deactivatePlan = async function (planId) {
    let config = {
      url: `/v1/billing/plans/${planId}/deactivate`,
      data: {},
    };
    try {
      return await this.axiosPost(config);
    } catch (error) {
      console.dir(error.response.data, { depth: null });
      throw new Error('Internal Error: Error updating plan');
    }
  };
  this.retrievePlan = async function (params, planId) {
    let config = {
      url: `/v1/billing/subscriptions/${planId}`,
      data: params,
    };
    return await this.axiosGet(config);
  };
  this.axiosGet = async function (config) {
    return await axios({
      method: 'get',
      url: config.url,
      data: qs.stringify(config.data ?? {}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  this.axiosPost = async function (config) {
    return await axios({
      method: 'post',
      url: config.url,
      data: JSON.stringify(config.data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  this.axiosPatch = async function (config) {
    return await axios({
      method: 'patch',
      url: config.url,
      data: JSON.stringify(config.data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  /**
   * [filterParams filters paramters from null, undefined, empty strings, empty arrays and empty objects as it can cause unwanted changes]
   * @param  {object} params  [object that can contain one more object inside]
   * @return {object}         [object with only truth variables]
   */
  this.filterParams = function (params) {
    Object.keys(params).forEach((param) => {
      if (this.empty(params[param]) || params[param].length === 0) {
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
  this.empty = (value) => value === null || value === undefined;
}
