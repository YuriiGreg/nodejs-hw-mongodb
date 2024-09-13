const express = require('express');
const { getAllContacts, getContactById } = require('../controllers/contactController'); 
const router = express.Router();


router.get('/contacts', getAllContacts);

router.get('/contacts/:contactId', getContactById); 

module.exports = router;

