const userService = require('../database/services/UserService');
const User = require('../model/User');

module.exports = {
    async createUser(request, response) {
        try {
            const { FirstName, LastName, Email, Contact, Document, Type, Login, Password } = request.body;
            const user = new User( undefined , FirstName, LastName, Email, Contact, Document, Type, Login, Password);

            if (user.valid) {
                const id = await userService.createUser(user);
                return response.status(201).json({
                    User_ID: id
                });
            }
            else {
                return response.status(400).json({
                    message:"O objeto não passou pela validação."
                });
            }
                
        }
        catch (err) {
            if (err.name === 'LoginAlreadyExistsError') {
                return response.status(400).json({
                    message: err.message
                });
            }
            else{
                return response.status(500).json({
                    message: err.message
                });
            }
        }
    },

    async login(request, response) {
        try {
            const { Login, Password } = request.body;
            const loggedUser = await userService.login(Login, Password);
            return response.status(200).json(loggedUser);
        }
        catch (err) {
            return response.status(500).json({
                message: err.message
            });
        }
    },
    async uploadUserImg(request, response) {
        try {
            const User_ID = request.body.User_ID;
            const fileName = request.file.originalname;
            await userService.uploadUserImg(User_ID, fileName);
            return response.status(200);
        }
        catch (err) {
            return response.status(500).json({
                message: err.message
            });
        }
    }
};