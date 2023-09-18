// MODULES
const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

const { storeReturnTo } = require("../middleware");
const userController = require("../controllers/users")



// ROUTES
router.route("/register")
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.register));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userController.login);
    //passport.autheticate() -> passport middleware, can assign different strategy in different route

router.get("/logout", userController.logout);




module.exports = router;