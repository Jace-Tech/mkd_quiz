// const SessionService = require('../../services/SessionService');
const app = require("express").Router();
const db = require("../../models");
const axios = require("axios");

//api: get output variable info
app.get("/api/v1/output-variable/:name", async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const { name } = req.params;

    const outputVariable = await db.output_variable.getByFields({ name });
    if (!outputVariable) {
      return res.status(404).json({ success: false, message: `Output variable of that name ${name} is not found.` });
    }
    let payload = {},
      actives = [];
    if (outputVariable.active_list) {
      let activeList = JSON.parse(outputVariable.active_list);
      for (const activeId of activeList) {
        const active = await db.active.getByPK(activeId);
        if (active) {
          actives.push(active.name);
        }
      }
    }
    payload = { name: outputVariable.name, actives: actives, ranges_response: JSON.parse(outputVariable.ranges_response) };

    return res.status(201).json({ success: true, data: payload });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.get("/api/v1/output-variables/actives-list", async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const { names_list } = req.query;
    if (!names_list) {
      return res.status(401).json({ success: false, message: "Empty list" });
    }
    const outputVariablesList = names_list.split(",");

    const outputVars = await db.output_variable.findAll({
      where: {
        name: outputVariablesList,
      },
    });

    let allActivesList = [];
    outputVars.forEach((outputVar) => {
      if (outputVar.active_list) {
        let parsedList = JSON.parse(outputVar.active_list);
        if (parsedList.length) {
          parsedList.forEach((item) => {
            if (!allActivesList.includes(item)) {
              allActivesList.push(item);
            }
          });
        }
      }
    });

    let actives = await db.active
      .findAll({
        where: {
          id: allActivesList,
        },
      })
      .then((data) => {
        return data.map((item) => {
          return item.name;
        });
      });
    if (!actives) {
      return res.status(404).json({ success: false, message: "No actives found for this list" });
    }
    return res.status(201).json({ success: true, data: actives });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.get("/api/v1/places/autocomplete", async function (req, res, next) {
  try {
    const { input } = req.query;

    var config = {
      method: "get",
      // url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(regions)&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      headers: {},
    };

    const response = await axios(config).then(function (response) {
      return response.data;
    });
    const payload = response.predictions.map((prediction) => {
      return {
        name: prediction.description,
        id: prediction.place_id,
      };
    });

    return res.status(201).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});
app.get("/api/v1/rules", async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const rules = await db.rule.getAll();

    if (!rules) {
      return res.status(404).json({ success: false, message: `There are no rules` });
    }

    return res.status(201).json({ success: true, data: rules });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.get("/api/v1/profile-sections", async function (req, res, next) {
  try {
    //body should have actives lsit as array
    const profileSections = await db.result_profile.getAll();

    if (!profileSections) {
      return res.status(404).json({ success: false, message: `There are sections to display` });
    }

    for (const section of profileSections) {
      if (section.output_variable_list) {
        const parsedList = JSON.parse(section.output_variable_list);
        let actualList = await db.output_variable.findAll({
          where: {
            id: parsedList,
          },
        });
        actualList = actualList.map((ov) => ov.name);
        section.output_variable_list = actualList;
      }
    }
    return res.status(201).json({ success: true, data: profileSections });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.get("/api/v1/weather-profile", async function (req, res, next) {
  try {
    const { city_id } = req.query;
    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${city_id}&fields=geometry,formatted_address,address_component&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      headers: {},
    };

    const place_details = await axios(config);
    // .then((response) => response.data);
    if (place_details?.data?.status !== "OK") {
      console.error(place_details);
      return res.status(400).json({ success: false, message: "Can't get location" });
    }
    const lon = place_details.data.result.geometry.location.lng;
    const lat = place_details.data.result.geometry.location.lat;
    const country = place_details.data.result.address_components.find((adr) => adr.types.includes("country"));
    // const country;
    config = {
      method: "get",
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`,
    };

    const weather = await axios(config).then((response) => response.data);

    config = {
      method: "get",
      url: `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`,
    };
    const pollutionData = await axios(config).then((response) => response.data);

    // let temperatureWeight = weather.main.temp;
    let { sunValue, sunWeight, temperatureWeight } = calculateSun(weather.main.temp);
    let { humidityValue, humidityWeight } = calculateHumidity(weather.main.humidity);
    let { pollutionValue, pollutionWeight } = calculatePollution(pollutionData.list[0].main.aqi);
    let temperature = weather.main.temp;
    let unit = "°C";
    if (country.short_name == "GB" || country.short_name == "US") {
      temperature = (temperature * 9) / 5 + 32;
      unit = "°F";
    }
    let payload = {
      unit: unit,
      humidity: humidityValue,
      temperature: Math.round(temperature),
      sun: sunValue,
      pollution: pollutionValue,
      weights: {
        Pollution: {
          value: pollutionWeight,
          base: 33,
        },
        Sun: {
          value: sunWeight,
          base: 10,
        },
        Temperature: {
          value: temperatureWeight,
          base: 0,
        },
        Hydration: {
          value: humidityWeight,
          base: 15,
        },
      },
    };
    return res.status(201).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

function calculateSun(sunTemp) {
  let maxSun = 56.7;
  let sun = parseFloat(sunTemp / maxSun) * 100;
  if (sun > 0 && sun <= 33.334) {
    return {
      sunValue: "low",
      sunWeight: 33.334 * 10,
      temperatureWeight: 0,
    };
  } else if (sun > 33.334 && sun <= 66.667) {
    return {
      sunValue: "medium",
      sunWeight: 66.667 * 10,
      temperatureWeight: 0,
    };
  } else if (sun > 66.667 && sun <= 100) {
    return {
      sunValue: "High",
      sunWeight: 100 * 10,
      temperatureWeight: 0,
    };
  } else {
    return {
      sunValue: "",
      sunWeight: 0,
      temperatureWeight: 0,
    };
  }
}
function calculateHumidity(humidity) {
  if (humidity < 30) {
    return {
      humidityValue: "Low",
      humidityWeight: 33.334 * 15,
    };
  } else if (humidity >= 30 && humidity < 50) {
    return {
      humidityValue: "Medium",
      humidityWeight: 66.667 * 15,
    };
  } else if (humidity >= 50) {
    return {
      humidityValue: "High",
      humidityWeight: 100 * 15,
    };
  } else {
    return {
      humidityValue: "",
      humidityWeight: 0,
    };
  }
}
function calculatePollution(airQuality) {
  // Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
  if (airQuality == 1) {
    return {
      pollutionValue: "Very low",
      pollutionWeight: 20 * 33,
    };
  } else if (airQuality == 2) {
    return {
      pollutionValue: "Low",
      pollutionWeight: 40 * 33,
    };
  } else if (airQuality == 3) {
    return {
      pollutionValue: "Moderate",
      pollutionWeight: 60 * 33,
    };
  } else if (airQuality == 4) {
    return {
      pollutionValue: "High",
      pollutionWeight: 80 * 33,
    };
  } else if (airQuality == 5) {
    return {
      pollutionValue: "Very high",
      pollutionWeight: 100 * 33,
    };
  } else {
    return {
      pollutionValue: "",
      pollutionWeight: 0,
    };
  }
}
module.exports = app;
