const cloudinary = require("cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImage = async (FileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(FileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    return error;
  }
};

const cloudinaryRemoveImage = async (ImagePublic) => {
  try {
    const data = await cloudinary.uploader.destroy(ImagePublic);
    return data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
