const router = require("express").Router();

const {
  GetRecordActivity,
  CountRecordActivity,
  UpdateRecordActivity,
  DeleteRecordActivity,
  AddRecordActivity,
} = require("../controller/RecordController");
const upload = require("../utils/multer");
router.get("/count", CountRecordActivity);

router.route("/").get(GetRecordActivity).post(upload.single("Image"),AddRecordActivity);

router.route("/:id").put(UpdateRecordActivity).delete(DeleteRecordActivity);

module.exports = router;
