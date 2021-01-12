var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');

router.get("/checkuserexists/:email", userController.checkuserexists);
router.post("/signup", userController.signup);
router.get("/sendemailverificationcode/:userId", userController.sendemailverificationcode);
router.get("/verifyemail/:userId", userController.verifyemail);
router.post("/login", userController.login);
router.get("/forgetpassword/:email", userController.forgetpassword);
router.post("/setnewpassword", userController.setnewpassword);
router.post("/changepassword", userController.changepassword);

module.exports = router;