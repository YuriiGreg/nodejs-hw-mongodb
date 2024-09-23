const contacts = [];
const createError = require('http-errors');

const deleteContactById = async (contactId) => {
  const contactIndex = contacts.findIndex(contact => contact.id === Number(contactId));
  if (contactIndex === -1) {
    throw createError(404, 'Contact not found');
  }

  contacts.splice(contactIndex, 1);
};

module.exports = {
  deleteContactById,
};
