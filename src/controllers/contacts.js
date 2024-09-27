const contactsService = require('../services/contacts');
const createError = require('http-errors');

const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.getAll();
        res.json({ status: 200, message: 'Contacts retrieved successfully', data: contacts });
    } catch (error) {
        next(createError(500, 'Failed to retrieve contacts'));
    }
};

const getContactById = async (req, res, next) => {
    try {
        const contact = await contactsService.getById(req.params.contactId);
        if (!contact) {
            throw createError(404, 'Contact not found');
        }
        res.json({ status: 200, message: 'Contact retrieved successfully', data: contact });
    } catch (error) {
        next(error);
    }
};

const createContact = async (req, res, next) => {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        return next(createError(400, 'Missing required fields: name, phoneNumber, or contactType.'));
    }

    try {
        const contact = await contactsService.create(req.body);
        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: contact,
        });
    } catch (error) {
        next(createError(500, 'Failed to create contact'));
    }
};

const updateContact = async (req, res, next) => {
    try {
        const contact = await contactsService.update(req.params.contactId, req.body);
        if (!contact) {
            throw createError(404, 'Contact not found');
        }
        res.json({ status: 200, message: "Successfully patched a contact!", data: contact });
    } catch (error) {
        next(error);
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const contact = await contactsService.remove(req.params.contactId);
        if (!contact) {
            throw createError(404, 'Contact not found');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};



