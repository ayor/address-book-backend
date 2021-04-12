const db = require('../firebase_config').database();

const contactRef = db.ref('contacts');

class Contact {
    constructor(username, email, address, phone){
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
    static  getContacts(){
      return contactRef.once('value');
    }
    static async findById(contactId){
        return await contactRef.child(contactId).get();
    }

    static async findByIdAndUpdate(contactId, update){
        return await contactRef.child(contactId).update(update);
    }

    static async deleteById(contactId){
      return await contactRef.child(contactId).remove();
    }

    async save() {
     return await contactRef.push({
            username: this.username,
            email: this.email,
            phone: this.phone,
            address: this.address
        });
    }
}

module.exports = Contact; 
