var express = require('express');
var router = express.Router();

const userController = require('../controller/user.controller');

router.get("/checkuserexists/:email", userController.checkuserexists);
router.post("/signup", userController.signup);

module.exports = router;
