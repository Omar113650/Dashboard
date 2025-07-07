"use strict";
const router = require("express").Router();
const { GetTask, CountTask, UpdateDeal, DeleteTask, AddTask, } = require("../controller/NewTaskController");
const ValidateID = require("../middleware/ValidateId");
router.get("/count", CountTask);
router.route("/").get(GetTask).post(AddTask);
router.route("/:id").put(ValidateID, UpdateDeal).delete(ValidateID, DeleteTask);
module.exports = router;
