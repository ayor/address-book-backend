const Contact = require('../model/Contact');
const FLATTEN_FIREBASE_DATA = require('../Flatten_DB');

const User = require('../model/User')
exports.handleUssd = async (req, res, next) => {
    try {
        const {
            sessionId,
            serviceCode,
            phoneNumber,
            text,
        } = req.body;

        const users = await User.GetUsers();
        const result = FLATTEN_FIREBASE_DATA(users.val());
        const user = result.find(el => el.phone === phoneNumber);
        const contacts = FLATTEN_FIREBASE_DATA(user.contacts);

        let response = '';

        switch (text) {

            case '1':
                if (user) {
                    response = `END Hello ${user.username}, 
                    
                    These are your contact(s)
                    ${contacts.map((contact, ind) => {
                                    return `${ind + 1}. Name - ${contact.username}`
                                })}
                    `;
                } else {
                    response = `CON Kindly visit https://adress-book-versus.netlify.app to sign up for this service`;
                }
                break;
            case '2':
                if (user) {
                    // Business logic for first level response
                    // This is a terminal request. Note how we start the response with END
                    response = `CON Kindly visit https://adress-book-versus.netlify.app to add a contact
                `;
                } else {
                    response = `CON Kindly visit https://adress-book-versus.netlify.app to sign up for this service`;
                }
                break;
            case '2*1':
                if (user) {
                    // Business logic for first level response
                    // This is a terminal request. Note how we start the response with END
                    response = `CON Kindly enter the contact's name
                `;
                } 
                break;
            default:
                // This is the first request. Note how we start the response with CON
                response = `CON What would you like to check
                1. My contacts
                2. Add a new contact`;
                break;
        }




        // Send the response back to the API
        res.set('Content-Type: text/plain');
        res.send(response);


    } catch (error) {
        next(error);
    }
};