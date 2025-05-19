// const express = require("express");
// const { upload } = require("../config/multer");
// const router = express.Router();


// router.post("/upload", upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "pdf", maxCount: 1 }
// ]), (req, res) => {
//   try {
//     const imageFile = req.files.image?.[0];
//     const pdfFile = req.files.pdf?.[0];

//     if (!imageFile || !pdfFile) {
//       return res.status(400).json({ error: "Both image and PDF files are required." });
//     }

//     res.json({
//       message: "Files uploaded successfully!",
//       imageUrl: imageFile.path,
//       pdfUrl: pdfFile.path
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;