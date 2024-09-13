const Contact = require('../models/contactModel');

const getContactsFromDB = async () => {
  return await Contact.find({});
};

const getContactByIdFromDB = async (contactId) => {
  return await Contact.findById(contactId);
};

module.exports = {
  getContactsFromDB,
  getContactByIdFromDB,
};
