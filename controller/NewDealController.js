// controller/DealController.js

import { validateCreateDeal, Deal } from "../models/NewDeal.js";
import asyncHandler from "express-async-handler";
import path from "path";
import logger from "../utils/logger.js";
import fs from "fs";
import {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} from "../utils/Cloudinary.js";

// @desc Get all Deals
// @route GET /api/deals
// @access Private
export const GetDeal = asyncHandler(async (req, res) => {
  const deals = await Deal.find();
  res.json(deals);
});

// @desc Add Deal
// @route POST /api/deals
// @access Private
export const AddDeal = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const { error } = validateCreateDeal(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const result = await cloudinaryUploadImage(req.file.buffer);

  if (!result.secure_url) {
    logger.error("Cloudinary upload failed: %o", result);
    return res.status(500).json({ message: "Image upload failed" });
  }

  const newDeal = await Deal.create({
    ...req.body,
    RoomImage: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  res.status(201).json({ deal: newDeal, message: "Success" });
});

// @desc Delete Deal
// @route DELETE /api/deal/:id
// @access Private
export const DeleteDeal = asyncHandler(async (req, res) => {
  const dealId = req.params.id;
  if (!dealId) {
    return res.status(400).json({ message: "No deal ID provided" });
  }

  const deletedDeal = await Deal.findByIdAndDelete(dealId);
  if (!deletedDeal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  if (deletedDeal?.RoomImage?.publicId) {
    await cloudinaryRemoveImage(deletedDeal.RoomImage.publicId);
  }

  res.json({ message: "Deal deleted successfully" });
});

// @desc Update Deal
// @route PUT /api/deals/:id
// @access Private
export const UpdateDeal = asyncHandler(async (req, res) => {
  const { id: dealId } = req.params;
  const updates = { ...req.body };

  const existingDeal = await Deal.findById(dealId);
  if (!existingDeal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  if (req.file) {
    if (existingDeal.RoomImage?.publicId) {
      await cloudinaryRemoveImage(existingDeal.RoomImage.publicId);
    }

    const uploaded = await cloudinaryUploadImage(req.file.buffer);
    if (!uploaded?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    updates.RoomImage = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const updatedDeal = await Deal.findByIdAndUpdate(
    dealId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: "Success", deal: updatedDeal });
});

// @desc Count Deals
// @route GET /api/deals/count
// @access Private
export const CountDeals = asyncHandler(async (req, res) => {
  const count = await Deal.countDocuments();
  res.json({ count });
});
