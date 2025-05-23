// defining the schema for listing
const mongoose=require("mongoose");
const Schema=mongoose.Schema
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        // type:String,
        // set: (v)=>v===""
        // ?"https://images.unsplash.com/photo-1731432245325-d820144afe4a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // :v,
        // // sets to default link if v is empty otherwise to v 
        // default: "https://images.unsplash.com/photo-1731432245325-d820144afe4a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // // image aa hi nahi rhi to bhi default is this
        url:String,
        filename: String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:
        {type:Schema.Types.ObjectId,
            ref:"User"
        }
    ,
    geometry:{
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }  
    
});

listingSchema.post("findOneAndDelete", async (listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
}
// if _id is in the listing.reviews list then the review is deleted after the listing is deleted if there is a listing that is deleted not a null value
// koi listing aayi hai to hi 
});

const Listing=mongoose.model("Listing", listingSchema);

module.exports=Listing;

