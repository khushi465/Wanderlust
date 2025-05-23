const express=require("express");
const router=express.Router();
const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        // redirect url save. so that after login it is redirected to the path it was on not to /listings
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to login/signup first");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    // 2 parts once findbyid and then update if the owner is the current user
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser.id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
        //    not return will still edit
    }
    next();
    // de construct and update the value with name
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // deconstruct
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    // for all the detail object elements error message is printed seperated by ,
}
else {
    next();
}
}
// this acts as a middleware

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
        let {id,reviewId}=req.params;
        // 2 parts once findbyid and then update if the owner is the current user
        let review=await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currUser.id)){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`);
            //    not return will still edit
        }
        next();
   
}