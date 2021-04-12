const User = require('../model/User');
const Contact = require('../model/Contact');
const bcrypt = require('bcryptjs');
const FLATTEN_FIREBASE_DATA = require('../Flatten_DB');

exports.createUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);
        let admin = await (await Contact.findById("-MY2FDZVmiX6qJ2bIwsu")).val();

        const userData = await User.GetUsers();

        if (!userData.exists()) {
            let user = new User(username, hashedPassword, email);
            
            await user.save(admin);            

            res.status(201).json({
                message: "successfully created user",
                user
            });
            return;
        };

        const result = FLATTEN_FIREBASE_DATA(userData.val());
        const userExists = result.find(el => el.username == username || el.email === email);

        if (userExists) {
            let err = new Error();
            err.status = 401;
            err.message = "this user already exists"
            throw err;
        }
        let user = new User(username, hashedPassword, email);

        const savedUser =  await user.save(admin);
        const res_user =   savedUser.val()

        res.status(201).json({
            message: "successfully created user",
            user: {id: savedUser.key ,...res_user}
        });
    } catch (error) {
        
        next(error);
    }
}


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.GetUsers();

        if (userData.exists()) {
            const result = FLATTEN_FIREBASE_DATA(userData.val());
            const user = result.find(el => el.email === email);
            if (!user) {
                let err = new Error();
                err.status = 401;
                err.message = "invalid email or password";
                throw err;
            }
            let isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                let err = new Error();
                err.status = 401;
                err.message = "invalid email or password";
                throw err;
            }
            res.status(200).json({
                user
            });
        }
    } catch (error) {
        if (!error.status) {
            error.status = 500;
            error.message = "An error occured while retreiving the user";
        }
        next(error);
    }
}