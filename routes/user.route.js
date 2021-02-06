var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const {pps} = require('../functions/uploadprofilepicture');

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

