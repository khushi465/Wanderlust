const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
email:{
    type:String,
    required:true
},

});

userSchema.plugin(passportLocalMongoose);

// passport automatically stores a username and hashed password and salt 
module.exports=mongoose.model("User", userSchema);