const userService = require('../database/services/UserService');

module.exports = {
    async createUser(request, response) {
        try {
            const { FirstName, LastName, Login, Password, Email, Contact, Document, Type } = request.body;

            const insertedId = await userService.createUser(FirstName, LastName, Login, Password, Email, Contact, Document, Type);

            return response.status(201).json({
                User_ID: insertedId
            });
        }
        catch (err) {
            if (String(err).includes('UNIQUE constraint failed:')) {
                if (String(err).includes('user.Login')) {
                    return response.status(204).json({ errors: ["Login already exists!"] });
                }
            }
        }
    },

    async login(request, response) {
        try {
            const { Login, Password } = request.body;
            const loggedUser = await userService.login(Login, Password);
            
            return response.json(loggedUser);
        }
        catch (err) {
            throw err;
        }
    },
    async uploadUserImg(request, response) {
        try {
            await userService.uploadUserImg(request.body.User_ID, request.file.originalname);
        }
        catch (err) {
            throw err;
        }
    }
};