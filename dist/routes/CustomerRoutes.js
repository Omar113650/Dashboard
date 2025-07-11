"use strict";
const router = require("express").Router();
const { GetCustomer, CountCustomers, UpdateCustomer, DeleteCustomer, AddCustomer, } = require("../controller/CustomerController");
const { ValidateID } = require("../middleware/ValidateId");
const upload = require("../utils/multer");
router.route("/count").get(CountCustomers);
router.route("/").get(GetCustomer).post(upload.single("Avatar"), AddCustomer),
    router
        .route("/:id")
        .delete(ValidateID, DeleteCustomer)
        .put(ValidateID, UpdateCustomer);
module.exports = router;
