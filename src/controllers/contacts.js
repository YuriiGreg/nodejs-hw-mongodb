const createError = require('http-errors');
const contactsService = require('../services/contacts'); 
const Contact = require('../models/contactModel');
const { createContactSchema, updateContactSchema } = require('../schemas/contactSchemas');

const getAllContacts = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

        const filter = { userId: req.user._id }; 
        if (type) {
            filter.contactType = type;
        }
        if (isFavourite !== undefined) {
            filter.isFavourite = isFavourite === 'true';
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(perPage, 10),
            sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        };

        const result = await Contact.paginate(filter, options);

        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: {
                data: result.docs,
                page: result.page,
                perPage: result.limit,
                totalItems: result.totalDocs,
                totalPages: result.totalPages,
                hasPreviousPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
            }
        });
    } catch (error) {
        next(createError(500, 'Failed to retrieve contacts'));
    }
};

const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id }); 
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
        const contactData = {
            ...req.body,
            userId: req.user._id 
        };

        const contact = new Contact(contactData);
        await contact.save();
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
        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.contactId, userId: req.user._id }, 
            req.body,
            { new: true }
        ); 
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
        const contact = await Contact.findOneAndDelete({ _id: req.params.contactId, userId: req.user._id }); 
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





