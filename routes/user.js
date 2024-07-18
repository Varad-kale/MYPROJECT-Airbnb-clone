const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


router.route("/signup")
.get( userController.renderSignupform)
.post( userController.signup );

router.route("/login")
.get( userController.renderLoginform)
.post( saveRedirectUrl,  passport.authenticate("local", { 
    failureRedirect: '/login',
     failureFlash: true } ) ,
     userController.login );

// router.get("/signup", userController.renderSignupform);

// router.post("/signup", userController.signup );

// router.get("/login", userController.renderLoginform);

// router.post("/login", saveRedirectUrl,  passport.authenticate("local", { 
//     failureRedirect: '/login',
//      failureFlash: true } ) ,
//     userController.login );

router.get("/logout", userController.logout );

module.exports = router;

