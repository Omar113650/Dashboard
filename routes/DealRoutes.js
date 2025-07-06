const router = require("express").Router();

// استدعاء الدوال من الكنترولر
const {
  GetDeal,
  CountDeals,
  UpdateDeal,
  DeleteDeal,
  AddDeal,
} = require("../controller/NewDealController");
const upload = require("../utils/multer");
const ValidateID = require("../middleware/ValidateId");
router.get("/count", CountDeals);

router.route("/").get(GetDeal).post(upload.single("RoomImage"), AddDeal);

router.route("/:id").put(ValidateID, UpdateDeal).delete(ValidateID, DeleteDeal);

module.exports = router;
