"use strict";
const router = require("express").Router();
const { GetRecordActivity, CountRecordActivity, UpdateRecordActivity, DeleteRecordActivity, AddRecordActivity, } = require("../controller/RecordController");
const upload = require("../utils/multer");
const ValidateID = require("../middleware/ValidateId");
router.get("/count", CountRecordActivity);
router.route("/").get(GetRecordActivity).post(upload.single("Image"), AddRecordActivity);
router.route("/:id").put(ValidateID, UpdateRecordActivity).delete(ValidateID, DeleteRecordActivity);
module.exports = router;
