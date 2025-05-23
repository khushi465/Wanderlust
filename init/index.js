// adding the sampleListings in the database and removing any previous listings. this is the initializing script

const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
// goes out of init and in models by using ..

main().then(()=>console.log("Connection successful")).catch(err=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    // we add the owner to every listing using map function
   initData.data= initData.data.map((obj)=>({...obj, owner:"68092ac9649b2ef4ec6a3a96"}))
    await Listing.insertMany(initData.data);
    // console.log(initData.data);
    // initData is an object and data is the key which has the array of objects. 
    // initData is {data:[{},{}]}
    console.log("Data was initialized");
}
initDB();