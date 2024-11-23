const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "TECHRESOLVE",
    format: async (req, file) => file.mimetype.split("/")[1],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const cloud = multer({ storage: cloudStorage,
    limits:{fileSize: 10 * 1024 * 1024},
    fileFilter: (req,res, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        if(allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }else {
            cb(new Error("invalid file type"), false);
        }
    },
 });

module.exports = cloud;
