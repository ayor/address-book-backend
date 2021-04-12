const Contact = require('../model/Contact');
const User = require('../model/User');
const FLATTEN_FIREBASE_DATA = require('../Flatten_DB');

exports.createContact = async (req, res, next) => {
    try {
        const user_id = req.body.user_id;
        const username = req.body.username;
        const email = req.body.email;
        const address = req.body.address;
        const phone = req.body.phone;

        const contacts = await Contact.getContacts();

        if (contacts.exists()) {
            const db_result = FLATTEN_FIREBASE_DATA(contacts.val());
            const existingContact = db_result.find(contact => contact.username === username || contact.email === email);

            if (existingContact) {
                const err = new Error();
                err.message = "this contact already exists";
                err.status = 401;
                throw err;
            }

        }

        const contact = new Contact(username, email, address, phone);
        const savedContactRef = await contact.save();
        const key = savedContactRef.key;

        await User.findByIdAndUpdate(user_id, { key, ...contact });

        res.status(201).json({
            message: "successfully created contact",
            contact: { key, ...contact }
        })

    } catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
}

exports.deleteContact = async (req, res, next) => {
    try {
        const {contactId, userKey, userId } = req.body; 
        
        await Contact.deleteById(contactId);

        await User.removeContact(userId, userKey);

        const user = await (await User.findById(userId)).val();
        res.status(200).json({
            message: "successfully deleted",
            contacts: { ...user.contacts }
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllContacts = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const contacts = await (await User.getContacts(userId)).val();
        res.status(200).json({
            message: "success",
            contacts
        });

    } catch (error) {
        next(error)
    }
}
exports.getContact = async (req, res, next) => {
    try {
        const contactId = req.params.id.split('::')[1];

        const contact = await (await Contact.findById(contactId)).val();

        res.status(200).json({
            message: "success",
            contact
        });

    } catch (error) {
        next(error)
    }
}

exports.updateContact = async (req, res, next) => {
    try {
        const contactId = req.body.contactId.split(':')[1];
        const username = req.body.username;
        const userId = req.body.userId;
        const contactRef = req.body.contactRef;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;

        await User.UpdateUserContact(userId, contactRef, {
            username,
            phone,
            key: contactId,
            address,
            email
        });
        
        await Contact.findByIdAndUpdate(contactId, { username, phone, address, email });


        const contacts = await (await User.getContacts(userId)).val()

        res.status(200).json({
            message: "success",
            contacts
        });

    } catch (error) {
        next(error)
    }
}