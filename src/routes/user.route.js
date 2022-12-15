var express = require('express');
var router = express.Router();

const { multer } = require('../utils/multer');
const authController = require('../controller/user/auth.controller');
const passwordController = require('../controller/user/password.controller');
const profileController = require('../controller/user/profile.controller');
const userController = require('../controller/user/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// auth route
router.get("/checkuserexists/:email", authController.checkuserexists);
router.post("/signup", authController.signup);
router.get("/verifyemail/:userId", authController.verifyemail);
router.post("/login", authController.login);
router.get("/recentloginemailsend", authController.recentloginemailsend);

// password 
router.get("/forgetpassword/:email", passwordController.forgetpassword);
router.post("/setnewpassword", passwordController.setnewpassword);
router.post("/changepassword", authMiddleware, passwordController.changepassword);

// users
router.get("/getalluser", authMiddleware, userController.getalluser);
router.get("/getuser/:id", authMiddleware, userController.getuser);

// profile
router.get("/userprofile", authMiddleware, profileController.userprofile);
router.put("/edituserprofile", authMiddleware, profileController.edituserprofile);
router.post("/uploadprofilepicture", authMiddleware, multer.single("avatar"), profileController.uploadprofilepicture);

module.exports = router;