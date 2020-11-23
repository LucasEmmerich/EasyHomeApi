const connection = require('../connection');
const LoginAlreadyExistsError = require('../../errors/LoginAlreadyExistsError');
const DocumentAlreadyExistsError = require('../../errors/DocumentAlreadyExistsError');

module.exports = {
    async createUser(user) {
        const insertedId = connection('user')
            .insert(user)
            .then(id => id[0])
            .catch(err => {
                if (String(err).includes('UNIQUE constraint failed: user.Login')) throw new LoginAlreadyExistsError();
                if (String(err).includes('UNIQUE constraint failed: user.Document')) throw new DocumentAlreadyExistsError();
                if (String(err).includes('CHECK constraint failed: user')) throw new Error('Tipo de usuário não existente!');
            });
        return insertedId;
    },
    async getUser(Login) {
        const user = await connection('user').where('Login', Login).select('*').first();
        return user;
    },
    async uploadUserImg(userId, fileName) {
        await connection('user').where('Id', userId).update({
            ProfileImageUrl: `/public/user/${userId}/${fileName}`
        });
    }
};