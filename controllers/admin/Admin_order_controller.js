"use strict";

const app = require("express").Router();
const Sequelize = require("sequelize");
const logger = require("../../services/LoggingService");
let pagination = require("../../services/PaginationService");
let SessionService = require("../../services/SessionService");
let JwtService = require("../../services/JwtService");
const ValidationService = require("../../services/ValidationService");
const PermissionService = require("../../services/PermissionService");
const UploadService = require("../../services/UploadService");
const AuthService = require("../../services/AuthService");
const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get("/admin/orders/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/orders_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.order, "Orders", session.success, session.error, "/admin/orders");

    const format = req.query.format ? req.query.format : "view";
    const direction = req.query.direction ? req.query.direction : "DESC";
    const per_page = req.query.per_page ? req.query.per_page : 10;
    let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
    let orderAssociations = [];
    viewModel.set_order_by(order_by);
    let joins = order_by.includes(".") ? order_by.split(".") : [];
    order_by = order_by.includes(".") ? joins[joins.length - 1] : order_by;
    if (joins.length > 0) {
      for (let i = joins.length - 1; i > 0; i--) {
        orderAssociations.push(`${joins[i - 1]}`);
      }
    }
    // Check for flash messages
    const flashMessageSuccess = req.flash("success");
    if (flashMessageSuccess && flashMessageSuccess.length > 0) {
      viewModel.success = flashMessageSuccess[0];
    }
    const flashMessageError = req.flash("error");
    if (flashMessageError && flashMessageError.length > 0) {
      viewModel.error = flashMessageError[0];
    }

    viewModel.set_id(req.query.id ? req.query.id : "");
    viewModel.set_customer_shopify_id(req.query.customer_shopify_id ? req.query.customer_shopify_id : "");
    viewModel.set_shopify_id(req.query.shopify_id ? req.query.shopify_id : "");
    viewModel.set_financial_status(req.query.financial_status ? req.query.financial_status : "");
    viewModel.set_fulfillment_status(req.query.fulfillment_status ? req.query.fulfillment_status : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      customer_shopify_id: viewModel.get_customer_shopify_id(),
      shopify_id: viewModel.get_shopify_id(),
      financial_status: viewModel.get_financial_status(),
      fulfillment_status: viewModel.get_fulfillment_status(),
    });

    const count = await db.order._count(where, []);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/orders/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.order.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);

    viewModel.set_list(list);

    if (format == "csv") {
      const csv = viewModel.to_csv();
      return res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="export.csv"',
        })
        .send(csv);
    }

    // if (format != 'view') {
    //   res.json(viewModel.to_json());
    // } else {
    // }

    return res.render("admin/Orders", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Orders", viewModel);
  }
});

// APIS

app.get("/admin/api/orders", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  try {
    const user_id = req.user_id;
    const session = req.session;
    let listViewModel = require("../../view_models/orders_admin_list_paginate_view_model");
    let viewModel = new listViewModel(db.order, "Orders", session.success, session.error, "/admin/orders");
    const direction = req.query.direction ? req.query.direction : "ASC";
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
    let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
    let orderAssociations = [];
    viewModel.set_order_by(order_by);
    let joins = order_by.includes(".") ? order_by.split(".") : [];
    order_by = order_by.includes(".") ? joins[joins.length - 1] : order_by;
    if (joins.length > 0) {
      for (let i = joins.length - 1; i > 0; i--) {
        orderAssociations.push(`${joins[i - 1]}`);
      }
    }

    viewModel.set_id(req.query.id ? req.query.id : "");
    viewModel.set_customer_shopify_id(req.query.customer_shopify_id ? req.query.customer_shopify_id : "");
    viewModel.set_shopify_id(req.query.shopify_id ? req.query.shopify_id : "");
    viewModel.set_financial_status(req.query.financial_status ? req.query.financial_status : "");
    viewModel.set_fulfillment_status(req.query.fulfillment_status ? req.query.fulfillment_status : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      customer_shopify_id: viewModel.get_customer_shopify_id(),
      shopify_id: viewModel.get_shopify_id(),
      financial_status: viewModel.get_financial_status(),
      fulfillment_status: viewModel.get_fulfillment_status(),
    });

    let include = [];

    const { rows: allItems, count } = await db.order.findAndCountAll({
      where: where,
      limit: limit == 0 ? null : limit,
      offset: offset,
      include: include,
      distinct: true,
    });

    const response = {
      items: allItems,
      page,
      nextPage: count > offset + limit ? page + 1 : false,
      retrievedCount: allItems.length,
      fullCount: count,
    };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.get("/v1/api/order/customer", async function (req, res, next) {
  try {
    const { id } = req.query;
    console.log(id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Id not valid." });
    }
    const orders = await db.order.findAll({ where: { customer_shopify_id: id }, order: [["updated_at", "DESC"]] });
    console.log(orders);
    if (!orders || !orders.length) return res.status(404).json({ success: false, message: "Customer doesn't have any orders." });
    const answers = orders[0].answers ? JSON.parse(orders[0].answers) : [];

    return res.status(201).json({ success: true, data: answers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

module.exports = app;
