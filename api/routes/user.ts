import express, { Express } from "express";

import { createUser } from "../controller/userController";

const app: Express = express();

app.route("/api/user").post(createUser);

export default app;
