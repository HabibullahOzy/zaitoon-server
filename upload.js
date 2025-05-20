const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary");

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'image'
  }
});

// PDF storage
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product_pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'raw'
  }
});

// const upload = multer({
//   storage: function (req, file, cb) {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, pdfStorage);
//     } else {
//       cb(null, imageStorage);
//     }
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: file.mimetype.startsWith('image') ? 'product_images' : 'product_pdfs',
      resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw',
      public_id: `${Date.now()}-${file.originalname}`,
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
