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

router.get("/count", CountDeals);

router.route("/").get(GetDeal).post(upload.single("RoomImage"),AddDeal);

router.route("/:id").put(UpdateDeal).delete(DeleteDeal);

module.exports = router;
