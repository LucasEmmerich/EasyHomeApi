module.exports = class User {
    constructor(id , firstName, lastName, email, contact, document, type, login, password) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._contact = contact;
        this._document = document;
        this._type = type;
        this._login = login;
        this._password = password;
    }
    getEntity() {
        return {
            Id: this._id,
            FirstName: this._firstName,
            LastName: this._lastName,
            Email: this._email,
            Contact: this._contact,
            Document: this._document,
            Type: this._type,
            Login: this._login,
            Password: this._password
        }
    }
    get valid() {
        const regexLogin = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,19}$/igm);

        if (this._firstName.length < 2 || this._firstName.length > 40) return false;
        if (this._lastName.length < 2 || this._lastName.length > 40) return false;
        if (this._email.length < 5 || !this._email.includes('@', '.')) return false;
        if (this._contact.length != 10 && this._contact.length != 11) return false;
        if (this._type == 'Física' && this._document.length != 11) return false;
        if (this._type == 'Jurídica' && this._document.length != 14) return false;
        if (!regexLogin.test(this._login)) return false;
        if (this._password.length < 6 || this._password.length > 20) return false;

        return true;
    }
}