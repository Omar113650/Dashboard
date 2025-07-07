import express from "express";
const router = express.Router();

import {
  GetTask,
  CountTask,
  UpdateDeal,
  DeleteTask,
  AddTask,
} from "../controller/NewTaskController.js";

import { ValidateID } from "../middleware/ValidateId.js";

router.get("/count", CountTask);

router.route("/").get(GetTask).post(AddTask);

router.route("/:id").put(ValidateID, UpdateDeal).delete(ValidateID, DeleteTask);

export default router;
