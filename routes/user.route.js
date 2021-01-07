var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');

router.get("/checkuserexists/:email", userController.checkuserexists);
router.post("/signup", userController.signup);
router.get("/sendemailverificationcode/:userId", userController.sendemailverificationcode);
router.get("/resendemailverificationcode/:userId", userController.resendemailverificationcode);
router.get("/verifyemail/:code/:user", userController.verifyemail);
router.post("/login", userController.login);

module.exports = router;
