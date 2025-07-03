const mongoose = require("mongoose");
const Joi = require("joi");

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
      enum: [],
      required: true,
    },

    Progress: {
      type: String,
      enum: [],
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

const Deal = mongoose.model("Deal", newDealSchema);

function validateCreateDeal(data) {
  const schema = Joi.object({
    address: Joi.object({
      street: Joi.string().min(5).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      zipCode: Joi.string().min(4).max(15).required(),
    }).required(),

    RoomArea: Joi.number().min(1).required(),
    umberOfPeople: Joi.number().min(1).required(),
    AppointmentDate: Joi.date().iso().required(),
    SpecialInstructions: Joi.string().min(20).max(100).required(),
    RoomAccess: Joi.string().valid().required(),
    Progress: Joi.string().valid(),
    Price: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}

module.exports = {
  validateCreateDeal,
  Deal,
};
