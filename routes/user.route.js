var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/checkuserexists/:email", userController.checkuserexists);
router.post("/signup", userController.signup);
router.get("/verifyemail/:userId", userController.verifyemail);
router.post("/login", userController.login);
router.get("/forgetpassword/:email", userController.forgetpassword);
router.post("/setnewpassword", userController.setnewpassword);
router.post("/changepassword", userController.changepassword);
router.get("/recentloginemailsend", userController.recentloginemailsend);
router.get("/userprofile", authMiddleware, userController.userprofile);
router.post("/edituserprofile", authMiddleware, userController.edituserprofile);

module.exports = router;

