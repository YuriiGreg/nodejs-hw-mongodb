const Contact = require('../models/contactModel');
const createError = require('http-errors');

const getAll = async () => {
    return await Contact.find({});
};

const getById = async (contactId) => {
    return await Contact.findById(contactId);
};

const create = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

const update = async (contactId, contactData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }
    return updatedContact;
};

const remove = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    return contact;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};

