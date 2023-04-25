import express from "express";

import { createUser } from "../controller/userController";

const app = express();

app.route("/api/user").post(createUser);

module.exports = app;
