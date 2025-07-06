const {
  RecordActivity,
  validateCreateActivity,
} = require("../models/RecordActivity");
const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/Cloudinary");
const logger = require("../utils/logger");

// @desc Get all Record Activities
// @route GET /api/record-activities
// @access Private
module.exports.GetRecordActivity = asyncHandler(async (req, res) => {
  const records = await RecordActivity.find();
  res.json(records);
});

// @desc Add Record Activity
// @route POST /api/record-activities
// @access Private
module.exports.AddRecordActivity = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const { error } = validateCreateActivity(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const result = await cloudinaryUploadImage(req.file.buffer);

  if (!result.secure_url) {
    logger.error("Cloudinary upload failed: %o", result);
    return res.status(500).json({ message: "Image upload failed" });
  }

  const newRecord = await RecordActivity.create({
    ...req.body,
    Image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  res.status(201).json({ record: newRecord, message: "Success" });
});

// @desc Delete Record Activity
// @route DELETE /api/record-activities/:id
// @access Private
module.exports.DeleteRecordActivity = asyncHandler(async (req, res) => {
  const recordId = req.params.id;
  if (!recordId) {
    return res.status(400).json({ message: "No RecordActivity ID provided" });
  }

  const deletedRecord = await RecordActivity.findByIdAndDelete(recordId);
  if (!deletedRecord) {
    return res.status(404).json({ message: "RecordActivity not found" });
  }

  if (deletedRecord?.Image?.publicId) {
    await cloudinaryRemoveImage(deletedRecord.Image.publicId);
  }

  res.json({ message: "RecordActivity deleted successfully" });
});

// @desc Update Record Activity
// @route PUT /api/record-activities/:id
// @access Private
module.exports.UpdateRecordActivity = asyncHandler(async (req, res) => {
  const recordId = req.params.id;
  if (!recordId) {
    return res.status(400).json({ message: "No RecordActivity ID provided" });
  }

  const existingRecord = await RecordActivity.findById(recordId);
  if (!existingRecord) {
    return res.status(404).json({ message: "RecordActivity not found" });
  }

  const updatedData = { ...req.body };

  if (req.file) {
    if (existingRecord.Image?.publicId) {
      await cloudinaryRemoveImage(existingRecord.Image.publicId);
    }

    const uploaded = await cloudinaryUploadImage(req.file.buffer);
    if (!uploaded?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    updatedData.Image = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const updatedRecord = await RecordActivity.findByIdAndUpdate(
    recordId,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "RecordActivity updated successfully",
    record: updatedRecord,
  });
});

// @desc Count Record Activities
// @route GET /api/record-activities/count
// @access Private
module.exports.CountRecordActivity = asyncHandler(async (req, res) => {
  const count = await RecordActivity.countDocuments();
  res.json({ count });
});
