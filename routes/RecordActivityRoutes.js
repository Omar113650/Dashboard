import express from "express";
const router = express.Router();

import {
  GetRecordActivity,
  CountRecordActivity,
  UpdateRecordActivity,
  DeleteRecordActivity,
  AddRecordActivity,
} from "../controller/RecordController.js";

import upload from "../utils/multer.js";
import { ValidateID } from "../middleware/ValidateId.js";

router.get("/count", CountRecordActivity);

router
  .route("/")
  .get(GetRecordActivity)
  .post(upload.single("Image"), AddRecordActivity);

router
  .route("/:id")
  .put(ValidateID, UpdateRecordActivity)
  .delete(ValidateID, DeleteRecordActivity);

export default router;
