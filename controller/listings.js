const Listing=require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res,next)=>{
    let listings=await Listing.find({});
    // Listing.find().then((res)=>console.log(res));
    // console.log(listings);
    res.render("listings/index.ejs",{listings});
}

module.exports.new=(req,res)=>{
    // console.log(req.user); displays undefined if not logged in and user information if logged in
    // transfering the isAuthenticated logic to a middleware
    res.render("listings/new.ejs");
}

module.exports.create=async (req,res,next)=>{
    let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
console.log(response.body.features[0].geometry);
// limit 1 then features has 1 object 
// res.send("done");

    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(404,result.error);
    // }
    // similarly we can do that for each of the parameters. !newlisting.description then throw other error and so on
    // but will be tedious
    // we use joi to validate our schema  
            let newListing=new Listing(req.body.listing);
            // req.body ke andar ek key ka nam listing jiske andar ye sab aaye the
            // shorter way to declare. but we have to take it as listing[title] name and so on in the new.ejs
            let url=req.file.path;
            let filename=req.file.filename;
            newListing.owner=req.user._id;
            newListing.image={url,filename};
            newListing.geometry=response.body.features[0].geometry;
            // storing the user id in the owner as the listing is created
            // other wise gives error when trying to access the username of the owner
    
       let saved= await newListing.save();
       console.log(saved);
        req.flash("success","Added Listing successfully!!");
        // after new listing is created we save the flash message
        res.redirect("/listings");
    
    }

    module.exports.show=async (req,res,next)=>{
       
        let {id}=req.params;
        let listing=await Listing.findById(id).populate({path:"reviews", populate:({path:"author"})}).populate("owner");
        // taki reviews bhi sath me jae and owner ki info
        if(!listing){
            req.flash("error","Listing request does not exist!");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs",{listing});
    }

    module.exports.edit=async (req,res,next)=>{
        
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing request does not exist!");
            res.redirect("/listings");
        }
        // here we are changing the url
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    }

    module.exports.update=async (req,res,next)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400, "Send valid data for listing");
        // we did not need the next(err) because of wrapAsync
        // }
        let {id}=req.params;
        // 2 parts once findbyid and then update if the owner is the current user    
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true, new:true});
        if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        }
        await listing.save();
        console.log(req.body.listing);
        req.flash("success","Listing Updated!!");
        res.redirect(`/listings/${id}`);
    }

    module.exports.deleteListing=async (req,res,next)=>{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing deleted!!");
        res.redirect(`/listings`);
    }