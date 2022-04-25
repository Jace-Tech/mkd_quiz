"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * App
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

require("dotenv").config();
const {
	getLocalPath
} = require("./core/helpers");
const fs = require("fs");
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");
const PowerByService = require("./services/PowerByService");
const UploadService = require("./services/UploadService");
const cookieParser = require("cookie-parser");
const controllersEndpoints = require("./controllers/index");
const portalsEndpoints = require("./routes/index");
const db = require("./models");
const sessionClass = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const sizeOf = require("image-size");
let app = express();
const expressip = require("express-ip");

if (process.NODE_ENV === "maintenance") {
	app.all("*", (req, res) => {
		res.status(503).json({
			message: "website under maintenance"
		});
	});
}
app.set("iocContainer", process.env);
app.set("db", db);
app.use(expressip().getIpInfoMiddleware);
app.use(logger("dev"));
app.use(
	express.json({
		limit: "50mb",
		verify: (req, res, buf) => {
			req.rawBody = buf;
		},
	})
);
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(cors());
app.use(flash());
let session = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	name: "session",
	proxy: true,
	cookie: {
		maxAge: 60 * 60 * 1000
	},
};

app.set("trust proxy", true);
if (process.env.NODE_ENV === "production") {
	session.cookie.secure = true; // serve secure cookies
}
app.use(sessionClass(session));
app.set("view engine", "eta");
app.set("views", path.join(__dirname, "/views"));
app.use(cookieParser());
app.use(helmet());

app.use(PowerByService);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/version", (req, res) => res.status(200).json({
	version: process.env.VERSION
}));
app.get("/", (req, res, next) => {
	return res.send("<h1 style='text-align:left;'>Live!</h1>");
});

app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({
		message: err.message,
	});
});

//local upload default
const upload = UploadService.local_upload();
app.post("/v1/upload/file", upload.single("file"), async function (req, res, next) {
	try {
		const url = getLocalPath(req.file.path);
		let params = {
			url: url,
			user_id: req.session?.user || null,
			caption: req.body?.caption || null,
			type: +req.body?.type || null,
		};
		const uploadedfile = fs.readFileSync(req.file.path);
		if (!req.file.mimetype.includes("video")) {
			const dimensions = sizeOf(uploadedfile);
			params.width = dimensions.width;
			params.height = dimensions.height;
		}
		let createdImage = await db.image.insert(params);
		return res.status(201).json({
			id: createdImage,
			url
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: true,
			message: error.message
		});
	}
});

app.use(portalsEndpoints);
app.use(controllersEndpoints);

app.use((req, res, next) => {
	return res.status(404).send("<h1 style='text-align:left;'>Not found!</h1>");
});

module.exports = app;