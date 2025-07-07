import mongoose from "mongoose";
import Joi from "joi";

// Mongoose Schema
const newDealSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    RoomImage: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
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

    RoomArea: {
      type: Number,
      required: true,
    },

    numberOfPeople: {
      type: Number,
      required: true,
    },

    AppointmentDate: {
      type: Date,
      required: true,
    },

    SpecialInstructions: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 20,
    },

    RoomAccess: {
      type: String,
      enum: ["Elevator", "Stairs", "Ramp"],
      required: true,
    },

    Progress: {
      type: String,
      enum: ["Pending", "InProgress", "Completed"],
    },

    Price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Deal = mongoose.model("Deal", newDealSchema);

// Joi Validation
function validateCreateDeal(data) {
  const schema = Joi.object({
    customer: Joi.string().required(),

    Address: Joi.object({
      street: Joi.string().min(5).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      zipCode: Joi.string().min(4).max(15).required(),
    }).required(),

    RoomImage: Joi.object({
      url: Joi.string().uri().allow(""),
      publicId: Joi.string().allow(null, ""),
    }),

    RoomArea: Joi.number().min(1).required(),
    numberOfPeople: Joi.number().min(1).required(),
    AppointmentDate: Joi.date().iso().required(),
    SpecialInstructions: Joi.string().min(20).max(100).required(),
    RoomAccess: Joi.string().valid("Elevator", "Stairs", "Ramp").required(),
    Progress: Joi.string().valid("Pending", "InProgress", "Completed"),
    Price: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}

export { validateCreateDeal, Deal };
