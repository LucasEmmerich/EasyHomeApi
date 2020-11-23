module.exports = class Chat {
    constructor(user1ID, user2ID, message) {
        this._user1ID = user1ID;
        this._user2ID = user2ID;
        this._message = message;
    }
    getEntity() {
        return {
            User1_ID: this._user1ID,
            User2_ID: this._user2ID,
            Message: this._message
        }
    }
    get valid() {
        if (isNaN(this._user1ID) || isNaN(this._user2ID))
            return false;
        if (!this._message)
            return false;
        return true;
    }
}

    