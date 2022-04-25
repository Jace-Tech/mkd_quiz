const SessionService = require("../../services/SessionService");
const app = require("express").Router();
const db = require("../../models");
const role = 1;

app.get("/admin/letters/main", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const { order: orderId } = req.query;
  // const orderId = 2;
  const order = await db.order.getByPK(orderId);
  const firstName = JSON.parse(order.customer).first_name;
  res.render("admin/Letters/Main_Letter", {
    firstName,
    get_page_name: () => "Letter",
    _base_url: "/admin/letters/main",
  });
});

app.get("/admin/letters/profile", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const { order: orderId } = req.query;

  const order = await db.order.getByPK(orderId);
  const firstName = order.customer ? JSON.parse(order.customer).first_name ?? null : null;
  const profileCharcteristics = order.profile ? JSON.parse(order.profile) : [];
  res.render("admin/Letters/Profile_Letter", { firstName, profileCharcteristics, get_page_name: () => "Letter", _base_url: "/admin/letters/profile" });
});

app.get("/admin/letters/formula", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const { order: orderId } = req.query;

  const order = await db.order.getByPK(orderId);
  let activesNames = order.actives ? JSON.parse(order.actives) : [];
  if (activesNames && activesNames.length) activesNames = activesNames.filter((active) => active !== "Base");
  const { rows: actives, count } = await db.active.findAndCountAll({
    where: { name: { [db.Sequelize.Op.in]: activesNames } },
  });

  res.render("admin/Letters/Formula_Letter", { actives, count, get_page_name: () => "Letter", _base_url: "/admin/letters/formula" });
});

app.get("/admin/letters/instructions", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const { order: orderId } = req.query;

  const order = await db.order.getByPK(orderId);

  res.render("admin/Letters/Instructions_Letter", { get_page_name: () => "Letter", _base_url: "/admin/letters/instructions" });
});

app.get("/admin/letters/all", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const { order: orderId } = req.query;

  const order = await db.order.getByPK(orderId);

  const firstName = JSON.parse(order.customer).first_name;
  const profileCharcteristics = order.profile ? JSON.parse(order.profile) : [];

  let activesNames = order.actives ? JSON.parse(order.actives) : [];
  if (activesNames && activesNames.length) activesNames = activesNames.filter((active) => active !== "Base");
  const { rows: actives, count } = await db.active.findAndCountAll({
    where: { name: { [db.Sequelize.Op.in]: activesNames } },
  });

  res.render("admin/Letters/All", { firstName, profileCharcteristics, actives, count, get_page_name: () => "Letter", _base_url: "/admin/letters/all" });
});

app.get("/admin/dashboard", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  const config = await db.configuration.findOne({ where: { id: 1 }, include: [{ model: db.image, as: "image" }] });
  res.render("admin/Dashboard", {
    config,
    get_page_name: () => "Dashboard",
    _base_url: "/admin/dashboard",
  });
});

app.post("/questions/order/save", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    const questions = req.body;

    for (const question of questions) {
      if (question.id && question.order) {
        await db.question.edit({ order: question.order }, question.id);
      }
    }
    return res.json({ success: true, message: "Successfully updated orders" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to update orders" });
  }
});
app.post("/main-image/update", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    const { image_url } = req.body;
    await db.configuration.edit({ image_id: image_url }, 1);
    return res.json({ success: true, message: "Successfully updated image" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to update image" });
  }
});

app.get("/configurations", async function (req, res, next) {
  try {
    const config = await db.configuration.findOne({ where: { id: 1 }, include: [{ model: db.image, as: "image" }] });
    if (!config) {
      return res.status(404).json({ success: false, message: "No configurations found" });
    }
    return res.json({ success: true, payload: config });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to fetch configurations" });
  }
});

module.exports = app;
