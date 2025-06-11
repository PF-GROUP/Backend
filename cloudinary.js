require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configuracion Cloudinary
cloudinary.config({
  cloud_name: "dqpy1fd8i",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagePath = "./Assets/hotel.jpg";

// Subir imagen
async function uploadImage() {
  const results = await cloudinary.uploader.upload(imagePath);
  console.log(results);

  // Optimizacion de URL
  const url = cloudinary.url(results.public_id, {
    quality: "auto",
    fetch_format: "auto",
  });
  console.log(url);
}

uploadImage(imagePath)
  .then((url) => console.log("Image URL:", url))
  .catch((error) => console.error("Error:", error));
