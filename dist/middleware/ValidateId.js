"use strict";
const mongoose = require("mongoose");
module.exports.ValidateID = (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    next();
};
