var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const fs = require('fs');
const multer = require('multer');
const path = require('path');

// profile image upload start //
let storagepath = './storage';
let imagepath = storagepath + '/images';
let profileimagepath = imagepath + '/profile';
let folderpath = [storagepath, imagepath, profileimagepath];
function createfolders(){
  folderpath.map(fp => {
    if (!fs.existsSync(fp)) {
      fs.mkdirSync(fp);
    }
  })
}
const profilepicturestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    createfolders();
    cb(null, profileimagepath);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const pps = multer({ 
  storage: profilepicturestorage,
  limits : {
    fileSize: 1024* 1024 * 5
  },
  fileFilter : function(req, file, cb){
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
      cb(null, true);
    }
    else{
      cb(null, false);
    }
  }
});
// profile image upload start //

router.get("/checkuserexists/:email", userController.checkuserexists);
router.post("/signup", userController.signup);
router.get("/verifyemail/:userId", userController.verifyemail);
router.post("/login", userController.login);
router.get("/forgetpassword/:email", userController.forgetpassword);
router.post("/setnewpassword", userController.setnewpassword);
router.post("/changepassword", authMiddleware, userController.changepassword);
router.get("/recentloginemailsend", userController.recentloginemailsend);
router.get("/getalluser", authMiddleware, userController.getalluser);
router.get("/getuser/:id", authMiddleware, userController.getuser);
router.get("/userprofile", authMiddleware, userController.userprofile);
router.post("/uploadprofilepicture", pps.single("profilepicture"), userController.uploadprofilepicture);
router.put("/edituserprofile", authMiddleware, userController.edituserprofile);

module.exports = router;

