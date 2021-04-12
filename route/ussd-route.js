const express = require('express');
const router = express.Router();
const contactController = require('../controller/ussd-controller');

router.post('/contact', contactController.handleUssd);


module.exports = router;