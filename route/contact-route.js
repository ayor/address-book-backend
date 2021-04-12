const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact-controller');

router.post('/get-contacts', contactController.getAllContacts);
router.get('/contactInfo:id', contactController.getContact);
router.post('/update-contact', contactController.updateContact);
router.post('/setup',contactController.createContact);
router.post('/delete',contactController.deleteContact);

module.exports = router;