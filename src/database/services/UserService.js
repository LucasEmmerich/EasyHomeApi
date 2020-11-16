const connection = require('../connection');
const cryptography = require('../../helpers/cryptographyHelper');
const tokenHelper = require('../../helpers/tokenHelper');

module.exports = {
    async createUser(FirstName, LastName, Login, Password, Email, Contact, Document, Type) {
        try {
            const insertedId = await connection('user').insert({
                Login: Login,
                Password: cryptography.encryptPassword(Password),
                Email: Email,
                Contact: Contact,
                FirstName: FirstName,
                LastName: LastName,
                Document: Document,
                Type: Type
            }).returning('Id').then(Id => { return Id[0] });
            return insertedId;
        }
        catch (err) {
            throw err;
        }
    },
    async login(Login, Password) {
        const loggedUser = await connection('user').where('Login', Login).select('*').first();
        if (loggedUser !== undefined) {
            if(cryptography.verifyPassword(Password, loggedUser.Password)){
                const createdToken = tokenHelper.generateToken(loggedUser.Id, loggedUser.Login, loggedUser.FirstName,loggedUser.LastName);
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
    async uploadUserImg(userId,fileName) {
        await connection('user').where('Id', userId).update({
            ProfileImageUrl: `/public/user/${userId}/${fileName}` 
        });
    }
};