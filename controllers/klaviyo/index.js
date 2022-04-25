// const SessionService = require('../../services/SessionService');
const app = require("express").Router();
const db = require("../../models");
const axios = require("axios");
const cors = require("cors");

const quiz_list_id = "SuMRRB";
const klaviyo_api_key = "pk_026fc9c97c646a73a053c99ef8d8c9c53d";
const corsOptions = {
  origin: ["http://localhost:3001"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//api: get output variable info
app.post("/klaviyo/identity", cors(corsOptions), async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const { email, firstName, lastName } = req.body;
    let data = JSON.stringify({
      token: klaviyo_api_key,
      properties: {
        $email: email,
        $first_name: firstName,
        $last_name: lastName,
      },
    });

    let config = {
      method: "post",
      url: "https://a.klaviyo.com/api/identify",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    console.log(response.data);

    return res.status(201).json({ success: true, payload: response.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.post("/klaviyo/list", cors(corsOptions), async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const { email } = req.body;
    let data = JSON.stringify({
      profiles: [
        {
          email: email,
        },
      ],
    });

    let config = {
      method: "post",
      url: `https://a.klaviyo.com/api/v2/list/${quiz_list_id}/members?api_key=${klaviyo_api_key}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    console.log(response.data);

    return res.status(201).json({ success: true, payload: response.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

module.exports = app;
