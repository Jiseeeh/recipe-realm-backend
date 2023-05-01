import express from "express";

import {
  getRecipes,
  approveRecipe,
  disapproveRecipe,
  deleteRecipe,
  bulkApprove,
  bulkDisapprove,
  bulkDelete,
} from "../controller/adminController";

const app = express();

app.route("/api/admin/recipe").get(getRecipes);

app.route("/api/admin/bulkApprove").patch(bulkApprove);
app.route("/api/admin/bulkDisapprove").patch(bulkDisapprove);
app.route("/api/admin/bulkDelete").delete(bulkDelete);

app.route("/api/admin/approve/:id").patch(approveRecipe);
app.route("/api/admin/disapprove/:id").patch(disapproveRecipe);

app.route("/api/admin/recipe/:id").delete(deleteRecipe);

module.exports = app;
