const userService = require('../database/services/UserService');
const cryptographyHandler = require('../handlers/cryptographyHandler');
const tokenHelper = require('../handlers/tokenHandler');
const User = require('../model/User');

module.exports = {
    async createUser(request, response) {
        try {
            const { FirstName, LastName, Email, Contact, Document, Type, Login, Password } = request.body;
            const user = new User(undefined, FirstName, LastName, Email, Contact, Document, Type, Login, Password);


            if (user.valid) {
                const userEntity = user.getEntity();
                userEntity.Password = cryptographyHandler.encryptPassword(userEntity.Password);

                const id = await userService.createUser(userEntity);
                return response.status(201).json({
                    User_ID: id
                });
            }
            else {
                return response.status(400).json({
                    message: "O objeto não passou pela validação."
                });
            }

        }
        catch (err) {
            if (err.name === 'LoginAlreadyExistsError') {
                return response.status(400).json({
                    message: err.message
                });
            }
            else {
                return response.status(500).json({
                    message: err.message
                });
            }
        }
    },

    async login(request, response) {
        try {
            const { Login, Password } = request.body;
            const user = await userService.getUser(Login);
            
            if (user) {
                if (cryptographyHandler.verifyPassword(Password, user.Password)) {
                    const createdToken = tokenHelper.generateToken(user.Id, user.Login, user.FirstName, user.LastName);
                    user.Password = '';
                    return response.status(200).json({
                        auth: true,
                        token: createdToken,
                        userInformation: user
                    })
                }
                else {
                    return response.status(401).json({
                        motivo: 'Senha incorreta!'
                    });
                }
            }
            else {
                return response.status(401).json({
                    motivo: 'Login não existente!'
                });
            }
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