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
        let response = '';

        if (text == '') {
            // This is the first request. Note how we start the response with CON
            response = `CON What would you like to check
            1. My contacts
            2. Add a new contact`;
        } else if (text == '1') {
            // Business logic for first level response
            if (user) {
                response = `CON Hello ${user.username}, 
                
                These are your contact(s)
                ${user.contacts.forEach((contact, ind) => {
                    return `
                    ${ind + 1}. Name - ${contact.username}
                            Phone - ${contact.phone}
                            Email - ${contact.email}
                            Address - ${contact.address}`
                })}
                `;
            } else {
                response = `CON Kindly visit https://adress-book-versus.netlify.app to sign up for this service`;
            }
        } else if (text == '2') {
            // Business logic for first level response
            // This is a terminal request. Note how we start the response with END
            response = `CON Kindly enter the contact name`;
        } else if (text == '1*1') {
            // This is a second level response where the user selected 1 in the first instance
            response = `CON Kindly enter your username`;
            // This is a terminal request. Note how we start the response with END
            response = `END Your account number is ${accountNumber}`;
        } else if (text == '1*2') {
            // This is a second level response where the user selected 1 in the first instance
            const balance = 'KES 10,000';
            // This is a terminal request. Note how we start the response with END
            response = `END Your balance is ${balance}`;
        }

        // Send the response back to the API
        res.set('Content-Type: text/plain');
        res.send(response);


    } catch (error) {
        next(error);
    }
};