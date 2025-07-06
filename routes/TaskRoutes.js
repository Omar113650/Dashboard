const router = require("express").Router();

const {
  GetTask,
  CountTask,
  UpdateDeal,
  DeleteTask,
  AddTask,
} = require("../controller/NewTaskController");

router.get("/count", CountTask);

router.route("/").get(GetTask).post(AddTask);

router.route("/:id").put(UpdateDeal).delete(DeleteTask);

module.exports = router;
