// controller/CustomerController.js

import asyncHandler from "express-async-handler";
import { Customer, ValidationCreateCustomer } from "../models/Customer.js";
import {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} from "../utils/Cloudinary.js";

import logger from "../utils/logger.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ⛔ لأننا بنستخدم ES Modules، لازم نستخدم __dirname بالطريقة دي
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Get all customers
// @route GET /api/customers
// @access Private
export const GetCustomer = asyncHandler(async (req, res) => {
  const query = {};

  // ✅ تقدر تستخدم كل الشروط مع بعض، مش لازم else if
  if (req.query.Phone) {
    query.Phone = req.query.Phone;
  }

  if (req.query.city) {
    query["Address.city"] = { $regex: req.query.city, $options: "i" };
  }

  if (req.query.search) {
    query.FirstName = { $regex: req.query.search, $options: "i" };
  }

  // sort
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const customers = await Customer.find(query)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.json(customers);
});

// @desc Add new customer
// @route POST /api/customers
// @access Private
export const AddCustomer = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const { error } = ValidationCreateCustomer(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const result = await cloudinaryUploadImage(req.file.buffer);

  if (!result.secure_url) {
    fs.unlinkSync(imagePath);
    logger.error("Cloudinary upload failed: %o", result);
    return res.status(500).json({ message: "Image upload to cloud failed" });
  }

  const newCustomer = await Customer.create({
    ...req.body,
    Avatar: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  fs.unlinkSync(imagePath);

  res.status(201).json({ customer: newCustomer, message: "Success" });
});

// @desc Delete customer
// @route DELETE /api/customers/:id
// @access Private
export const DeleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.findByIdAndDelete(customerId);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (customer?.Avatar?.publicId) {
    await cloudinaryRemoveImage(customer.Avatar.publicId);
  }

  res.json({ message: "Customer deleted successfully" });
});

// @desc Update customer
// @route PUT /api/customers/:id
// @access Private
export const UpdateCustomer = asyncHandler(async (req, res) => {
  const { id: customerId } = req.params;
  const updates = { ...req.body };

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (req.file) {
    if (customer.Avatar?.publicId) {
      await cloudinaryRemoveImage(customer.Avatar.publicId);
    }

    const uploaded = await cloudinaryUploadImage(req.file.buffer);
    if (!uploaded?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    updates.Avatar = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: "Success", customer: updatedCustomer });
});

// @desc Count customers
// @route GET /api/customers/count
// @access Private
export const CountCustomers = asyncHandler(async (req, res) => {
  const count = await Customer.countDocuments();
  res.json({ count });
});
