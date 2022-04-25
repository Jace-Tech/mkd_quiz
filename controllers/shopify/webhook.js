const app = require("express").Router();
const db = require("../../models");
const crypto = require("crypto");
app.post("/v1/api/webhook", async function (req, res, next) {
  try {
    const hmac = req.get("X-Shopify-Hmac-Sha256");
    const rawBody = req.rawBody;
    if (!verify_webhook(rawBody, hmac)) {
      return res.sendStatus(403);
    }

    const webhookId = req.get("X-Shopify-Webhook-Id");
    const event = req.body;
    const currentOrderLineItems = event.line_items.map((item) => item.name);

    //this gets the first ever order of said customer since it can't happen unless he goes thro quiz.
    const customerId = event.customer.id;
    const customerOrderedBefore = await db.order.findOne({
      where: {
        customer_shopify_id: customerId,
      },
    });

    let attributes = event.note_attributes ?? [];

    if (!attributes.length) {
      if (!customerOrderedBefore) {
        return res.sendStatus(204);
      }
      attributes.push({
        name: "answers",
        value: customerOrderedBefore.answers, //we take old answers
      });
      attributes.push({
        name: "profile",
        value: customerOrderedBefore.profile, //we take old profile
      });
      attributes.push({
        name: "actives",
        value: JSON.stringify(currentOrderLineItems ?? []), //we take new actives
      });
    }

    if (await db.order.getByFields({ webhook_id: webhookId })) return res.sendStatus(205); //webhook handled before

    const orderExists = await db.order.getByFields({ shopify_id: `${event.id}` });
    const modelParams = {
      webhook_id: webhookId,
      shopify_id: event.id,
      customer_shopify_id: event.customer.id,
      customer: JSON.stringify(event.customer),
      answers: attributes.find((attr) => attr.name == "answers")?.value ?? "[]",
      profile: attributes.find((attr) => attr.name == "profile")?.value ?? "{}",
      actives: attributes.find((attr) => attr.name == "actives")?.value ?? "[]",
      items: JSON.stringify(event.line_items ?? []),
      financial_status: event.financial_status,
      fulfillment_status: event.fulfillment_status,
    };

    if (orderExists) {
      console.log("Modifying order");
      await db.order.edit(modelParams, orderExists.id);
    } else {
      console.log("Creating new order");
      await db.order.insert(modelParams);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = app;

function verify_webhook(data, hmac_header) {
  let calculated_hmac = crypto.createHmac("sha256", process.env.SHOPIFY_SECRET_KEY).update(data).digest("base64");
  return calculated_hmac == hmac_header;
}
