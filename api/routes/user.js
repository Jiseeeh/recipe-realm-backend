import express from "express";

import { createUser, checkUser } from "../controller/userController";

const app = express();

app.route("/api/user").get(checkUser).post(createUser);

module.exports = app;
