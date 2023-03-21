const path = require('path');
const multer = require('multer');

/* This is a multer middleware that is used to upload files. */
exports.multer = multer({
  storage:  multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext == ".jpeg" || ext == ".jpg" || ext == ".png" || ext == ".JPEG" || ext == ".JPG" || ext == ".png") {
      cb(null, true);
    }
    else {
      cb(new Error("File type supported only .jpeg, .jpg, .png, .JPEG, .JPG, .png,"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1
  },
});