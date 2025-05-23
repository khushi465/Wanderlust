const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY
});
// these names are important and default env names can be anything 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ['png','jpg','jpeg'], // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports={
    cloudinary,
    storage
};