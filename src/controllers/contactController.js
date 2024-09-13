const { getContactsFromDB, getContactByIdFromDB } = require('../services/contactService');

const getAllContacts = async (req, res) => {
  try {
    const contacts = await getContactsFromDB();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contacts',
      error: error.message,
    });
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactByIdFromDB(contactId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contact',
      error: error.message,
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
};

