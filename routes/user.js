const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controller/users.js")

router.route("/signup")
.get(userController.renderSignUpForm)
.post( wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), wrapAsync (userController.login));

router.get("/logout", userController.logout);

module.exports=router;

// passport stores the user's information in req.user.if undefined then not logged in. if logged in it stores the user info