const asyncHandler = require("express-async-handler");
const { Customer, ValidationCreateCustomer } = require("../models/Customer");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require("../utils/Cloudinary");
const logger =  require("../utils/logger")
const path = require("path");
const fs = require("fs");
// @desc Get all customers
// @route GET /api/customers
// @access Private
module.exports.GetCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// @desc Add new customer
// @route POST /api/customers
// @access Private
module.exports.AddCustomer = asyncHandler(async (req, res) => {
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


  // 5. إنشاء العميل
  const newCustomer = await Customer.create({
    ...req.body,
    Avatar: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // 6. حذف الصورة من السيرفر المحلي بعد الرفع
  fs.unlinkSync(imagePath);

  // 7. الرد بالنجاح
  res.status(201).json({ customer: newCustomer, message: "Success" });
});

// @desc Delete customer
// @route DELETE /api/customers/:id
// @access Private
module.exports.DeleteCustomer = asyncHandler(async (req, res) => {
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
module.exports.UpdateCustomer = asyncHandler(async (req, res) => {
  const { id: customerId } = req.params;
  const updates = { ...req.body };

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // لو فيه صورة جديدة
  if (req.file) {
    // حذف الصورة القديمة من Cloudinary (لو موجودة)
    if (customer.Avatar?.publicId) {
      await cloudinaryRemoveImage(customer.Avatar.publicId);
    }

    // رفع الصورة الجديدة
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
module.exports.CountCustomers = asyncHandler(async (req, res) => {
  const count = await Customer.countDocuments();
  res.json({ count });
});
