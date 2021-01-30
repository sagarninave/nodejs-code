var express = require('express');
var router = express.Router();

const openController = require('../controller/open.controller');

router.post("/contact", openController.contact);

module.exports = router;

