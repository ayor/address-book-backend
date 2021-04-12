const db = require('../firebase_config').database();

const userRef = db.ref('users');


class User {
    constructor(username, password, email, contacts) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.contacts = contacts;
    }

    static async GetUsers() {
        return await userRef.once('value');
    }

    static async findById(userId) {
        return await userRef.child(userId).get();
    }

    static async findByIdAndUpdate(user_id, data) {
       return await userRef.child(`${user_id}/contacts`).push({...data});
    }

    static async getContacts(userId){
      return await userRef.child(`${userId}/contacts`).get();
    }

    static async UpdateUserContact(userId,contactRef, data){
        return await userRef.child(`${userId}/contacts/${contactRef}`).update(data);
    }

    static async removeContact(user_id, userKey){
       return await userRef.child(`${user_id}/contacts/${userKey}`).remove();
    }

    async save(admin) {
       const user =  await userRef.push({
            username: this.username,
            password: this.password,
            email: this.email,
        });

        const adminData = {
            username: admin.username,
            phone: admin.phone,
            email: admin.email,
            address: admin.address
        }

    await userRef.child(`${user.key}/contacts`).push({key:"-MY2FDZVmiX6qJ2bIwsu", ...adminData});

    return await userRef.child(user.key).get();


    }
}

module.exports = User;