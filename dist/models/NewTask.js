"use strict";
const mongoose = require("mongoose");
const Joi = require("joi");
const NewTaskSchema = new mongoose.Schema({
    Description: {
        type: String,
        maxlength: 500,
        default: "",
    },
    DueDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
const NewTask = mongoose.model("NewTask", NewTaskSchema);
// Joi Validation
function validateCreateTask(data) {
    const schema = Joi.object({
        Description: Joi.string().max(500).allow("").optional(),
        DueDate: Joi.date().iso().required(),
    });
    return schema.validate(data);
}
module.exports = {
    NewTask,
    validateCreateTask,
};
