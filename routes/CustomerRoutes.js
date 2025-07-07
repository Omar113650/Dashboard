import express from "express";
const router = express.Router();

import {
  GetCustomer,
  CountCustomers,
  UpdateCustomer,
  DeleteCustomer,
  AddCustomer,
} from "../controller/CustomerController.js";

import { ValidateID } from "../middleware/ValidateId.js";
import upload from "../utils/multer.js";

router.route("/count").get(CountCustomers);

router
  .route("/")
  .get(GetCustomer)
  .post(upload.single("Avatar"), AddCustomer);

router
  .route("/:id")
  .delete(ValidateID, DeleteCustomer)
  .put(ValidateID, UpdateCustomer);

export default router;
