const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");


const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js")
const reviewController=require("../controller/reviews.js")


// REVIEW POST ROUTE
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// reviews ke liye show index route nahi create karna because hum individually usko nahi karenge access

// REVIEW DELETE ROUTE
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));


module.exports=router;

// since the path is matched with /listings/:id/reviews then the id parameter remains in the app.js only. after that is sent to the review.js
// so the id parameter does not reach the review.js so the error occurs. req.params.id remains undefined
// for this we need to use an external option of router called mergeParams . 