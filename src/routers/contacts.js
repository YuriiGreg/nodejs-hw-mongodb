const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const { ctrlWrapper } = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody'); 
const isValidId = require('../middlewares/isValidId');  
const { createContactSchema, updateContactSchema } = require('../schemas/contactSchemas'); 


router.get('/', ctrlWrapper(contactsController.getAllContacts));


router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactById));


router.post('/', validateBody(createContactSchema), ctrlWrapper(contactsController.createContact));


router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsController.updateContact));


router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));

module.exports = router;


