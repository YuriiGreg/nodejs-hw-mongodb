const contactsService = require('../services/contacts');
const createError = require('http-errors');

const getAllContacts = async (req, res) => {
    const contacts = await contactsService.getAll();
    res.json({ status: 200, data: contacts });
};

const getContactById = async (req, res, next) => {
    const contact = await contactsService.getById(req.params.contactId);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.json({ status: 200, data: contact });
};

const createContact = async (req, res) => {
    const contact = await contactsService.create(req.body);
    res.status(201).json({ status: 201, message: "Successfully created a contact!", data: contact });
};

const updateContact = async (req, res, next) => {
    const contact = await contactsService.update(req.params.contactId, req.body);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.json({ status: 200, message: "Successfully patched a contact!", data: contact });
};

const deleteContact = async (req, res, next) => {
    const contact = await contactsService.remove(req.params.contactId);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(204).send();
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
