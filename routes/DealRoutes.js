import express from "express";
const router = express.Router();

// استدعاء الدوال من الكنترولر
import {
  GetDeal,
  CountDeals,
  UpdateDeal,
  DeleteDeal,
  AddDeal,
} from "../controller/NewDealController.js";

import upload from "../utils/multer.js";
import { ValidateID } from "../middleware/ValidateId.js";

router.get("/count", CountDeals);

router.route("/").get(GetDeal).post(upload.single("RoomImage"), AddDeal);

router.route("/:id").put(ValidateID, UpdateDeal).delete(ValidateID, DeleteDeal);

export default router;
