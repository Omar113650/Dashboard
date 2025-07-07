import mongoose from "mongoose";
import Joi from "joi";

const RecordActivitySchema = new mongoose.Schema(
  {
    Description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    ActivityDate: {
      type: Date,
      required: true,
    },
    Image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const RecordActivity = mongoose.model("RecordActivity", RecordActivitySchema);

// Joi Validation
function validateCreateActivity(data) {
  const schema = Joi.object({
    Description: Joi.string().max(500).allow("").optional(),
    ActivityDate: Joi.date().iso().required(),
  });

  return schema.validate(data);
}

export { RecordActivity, validateCreateActivity };
