const axios = require("axios");

const app = require("express").Router();

app.get("/v1/api/get-shopify-products", async function (req, res, next) {
  try {
    var config = {
      method: "get",
      url: `https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}@${process.env.SHOPIFY_SITE}/admin/api/2021-10/products.json`,
      headers: {},
    };

    const response = await axios(config);
    return res.status(201).json(response.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = app;
