const { NewTask, validateCreateTask } = require("../models/NewTask");
const asyncHandler = require("express-async-handler");

// @desc Get all Task
// @route GET /api/deals
// @access Private
module.exports.GetTask = asyncHandler(async (req, res) => {
  const Task = await NewTask.find();
  res.json(Task);
});

// @desc Add Deal
// @route POST /api/deals
// @access Private
module.exports.AddTask = asyncHandler(async (req, res) => {
  const { error } = validateCreateTask(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newTask = await NewTask.create(req.body);

  res.status(201).json({ Task: newTask, message: "Success" });
});

// @desc Delete Deal
// @route DELETE /api/deals/:id
// @access Private
module.exports.DeleteTask = asyncHandler(async (req, res) => {
  const TaskId = req.params.id;
  if (!TaskId) {
    return res.status(400).json({ message: "No Task ID provided" });
  }
  const deletedTask = await NewTask.findByIdAndDelete(TaskId);
  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted successfully" });
});

// @desc Update Deal
// @route PUT /api/deals/:id
// @access Private
module.exports.UpdateDeal = asyncHandler(async (req, res) => {
  const TaskId = req.params.id;
  if (!TaskId) {
    return res.status(400).json({ message: "No Task ID provided" });
  }
  const updatedData = req.body;

  const updatedTask = await NewTask.findByIdAndUpdate(
    TaskId,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res
    .status(200)
    .json({ message: "Task updated successfully", deal: updatedTask });
});

// @desc Count Deals
// @route GET /api/deals/count
// @access Private
module.exports.CountTask = asyncHandler(async (req, res) => {
  const count = await NewTask.countDocuments();
  res.json({ count });
});
