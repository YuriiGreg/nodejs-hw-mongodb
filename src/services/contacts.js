const Contact = require('../models/contactModel');
const createError = require('http-errors');

const getContactsFromDB = async () => {
    try {
        return await Contact.find({});
    } catch (error) {
        throw createError(500, 'Failed to retrieve contacts');
    }
};

const getContactByIdFromDB = async (contactId) => {
    try {
        return await Contact.findById(contactId);
    } catch (error) {
        throw createError(500, 'Failed to retrieve contact');
    }
};

const create = async (contactData) => {
    const newContact = new Contact(contactData);
    try {
        return await newContact.save(); 
    } catch (error) {
        throw createError(500, 'Failed to create contact');
    }
};

const deleteContactById = async (contactId) => {
    try {
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            throw createError(404, 'Contact not found');
        }
        return contact; 
    } catch (error) {
        throw createError(500, 'Failed to delete contact');
    }
};

const update = async (contactId, contactData) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
        if (!updatedContact) {
            throw createError(404, 'Contact not found');
        }
        return updatedContact; 
    } catch (error) {
        throw createError(500, 'Failed to update contact');
    }
};

const remove = async (contactId) => {
    try {
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            throw createError(404, 'Contact not found');
        }
        return contact; 
    } catch (error) {
        throw createError(500, 'Failed to delete contact');
    }
};

module.exports = {
    getContactsFromDB,
    getContactByIdFromDB,
    create,
    deleteContactById,
    update,
    remove, 
};
