// const multer = require("multer");
// const cloudinary = require("./cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     let folder = "uploads/others";
//     let format = "";

//     if (file.mimetype.startsWith("image/")) {
//       folder = "uploads/images";
//       format = "jpg";
//     } else if (file.mimetype === "application/pdf") {
//       folder = "uploads/pdfs";
//       format = "pdf";
//     }

//     return {
//       folder,
//       format,
//       resource_type: "auto",
//     };
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };