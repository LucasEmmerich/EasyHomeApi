const connection = require('../connection');
const cryptographyHandler = require('../../handlers/cryptographyHandler');
const tokenHelper = require('../../handlers/tokenHandler');
const LoginAlreadyExistsError = require('../../errors/LoginAlreadyExistsError');

module.exports = {
    async createUser(user) {
        const entity = user.getEntity();
        entity.Password = cryptographyHandler.encryptPassword(entity.Password);

        const insertedId =
            connection('user')
                .insert(entity)
                .then(id=>id[0])
                .catch(err => {
                    if (String(err).includes('UNIQUE constraint failed:'))
                        if (String(err).includes('user.Login')) throw new LoginAlreadyExistsError();
                });
        return insertedId;
    },
    async login(Login, Password) {
        const loggedUser = await connection('user').where('Login', Login).select('*').first();
        if (loggedUser !== undefined) {
            if (cryptographyHandler.verifyPassword(Password, loggedUser.Password)) {
                const createdToken = tokenHelper.generateToken(loggedUser.Id, loggedUser.Login, loggedUser.FirstName, loggedUser.LastName);
                loggedUser.Password = '';
                return {
                    auth: true,
                    token: createdToken,
                    userInformation: loggedUser
                };
            }
            else {
                return {
                    auth: false,
                    motivo: 'Senha incorreta!'
                }
            }
        }
        else {
            return {
                auth: false,
                motivo: 'Login não existente!'
            }
        }
    },
    async uploadUserImg(userId, fileName) {
        await connection('user').where('Id', userId).update({
            ProfileImageUrl: `/public/user/${userId}/${fileName}`
        });
    }
};