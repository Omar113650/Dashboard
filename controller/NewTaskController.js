// controller/TaskController.js

import { NewTask, validateCreateTask } from "../models/NewTask.js";
import asyncHandler from "express-async-handler";

// @desc Get all Task
// @route GET /api/deals
// @access Private
export const GetTask = asyncHandler(async (req, res) => {
  const query = {};
  // search
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    query.$or = [{ DueDate: regex }];
  }

  // sort
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  const Task = await NewTask.find().sort({ [sortBy]: order });

  if (!Task) {
    return res.status(404).json({ message: "no found any deals " });
  }

  res.json(Task);
});

// @desc Add Deal
// @route POST /api/deals
// @access Private
export const AddTask = asyncHandler(async (req, res) => {
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
export const DeleteTask = asyncHandler(async (req, res) => {
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
export const UpdateDeal = asyncHandler(async (req, res) => {
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
export const CountTask = asyncHandler(async (req, res) => {
  const count = await NewTask.countDocuments();
  res.json({ count });
});
