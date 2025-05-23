const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res,next)=>{
    let {id}=req.params;
   let listing= await Listing.findById(id).populate("reviews");
   let review=new Review(req.body.review);
   review.author=req.user._id;
   listing.reviews.push(review);
   await review.save();
   await listing.save();
//    existing document me database me kuch change karne pe bhi save karna hoga
console.log("new review saved", id);
//    res.send(`new review saved   ${listing.reviews}`);
req.flash("success","New Review created!!");
res.redirect(`/listings/${id}`);
// /listings is imp just listings se dikkat hoti
// listing.reviews.pop();
// await listing.save();
// res.send(listing);
}

module.exports.deleteReview=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        // in the listing id, it pulls out like weed the one in reviews array that matches the reviewId
        // reviews array ke andar jo bhi review reviewid se match krega usko pull kardenge
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted!!");
        res.redirect(`/listings/${id}`);
    }