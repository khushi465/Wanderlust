const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js")
const multer=require("multer");
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});

router.route("/")
// index
.get(wrapAsync(listingController.index))
// create
.post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));
// .post(upload.single('listing[image]'), (req,res)=>{
//     res.send(req.file);
// });

router.get("/new", isLoggedIn, listingController.new);

router.route("/:id")
// show
.get(wrapAsync(listingController.show))
// patch
.patch(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.update)) 
// delete
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit));

module.exports=router; 