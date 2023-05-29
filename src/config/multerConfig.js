const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },

  // destination: (req, file, cb) => {
  //   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  //     cb(null, path.join(__dirname, "../public"));
  //   }
  //   if (file.mimetype === "video/mp4") {
  //     cb(null, path.join(__dirname, "../public"));
  //   } 
  //   else {
  //     cb(new Error("Unsupported file type!"), false);
  //   }
  // },
  // filename: (req, file, cb) => {
  //   cb(null, file.originalname);
  // },
});