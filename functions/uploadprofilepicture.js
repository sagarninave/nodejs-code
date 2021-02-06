const fs = require('fs');
const multer = require('multer');
const path = require('path');

let folderpath = ['./storage', './storage/images', './storage/images/profile'];

function createfolders() {
  folderpath.map(fp => {
    if (!fs.existsSync(fp)) {
      fs.mkdirSync(fp);
    }
  })
  return folderpath[folderpath.length-1];
}
const profilepicturestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, createfolders());
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const filefilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

exports.pps = multer({
  storage: profilepicturestorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: filefilter
});