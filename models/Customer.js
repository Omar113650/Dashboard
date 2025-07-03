const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema(
  {
    Avatar: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    FirstName: {
      type: String,
      required: true,
      trim: true,
    },
    LastName: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/],
    },
    Phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    Address: {
      street: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
      },
      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      zipCode: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 15,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

// Joi Validation
function ValidationCreateCustomer(obj) {
  const schema = Joi.object({
    FirstName: Joi.string().min(2).max(50).required(),
    LastName: Joi.string().min(2).max(50).required(),
    Email: Joi.string().email().required(),
    Phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    Address: Joi.object({
      street: Joi.string().min(5).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      zipCode: Joi.string().min(4).max(15).required(),
    }).required(),
  });

  return schema.validate(obj);
}

module.exports = {
  Customer,
  ValidationCreateCustomer,
};
