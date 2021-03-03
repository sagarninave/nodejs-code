var express = require('express');
var router = express.Router();

const connectionController = require('../controller/connection.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post("/follow", authMiddleware, connectionController.follow);

module.exports = router;

