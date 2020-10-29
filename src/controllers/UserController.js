const connection = require('../database/connection');
const cryptography = require('../helpers/cryptographyHelper');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async createUser(request, response) {
        const { Name, Login, Password, Email, Contact, Document,Type } = request.body;
        
        let insertedId = Number();
        try {
            await connection('user').insert({
                Login,
                Password: cryptography.encryptPassword(Password),
                Email,
                Contact,
                Name,
                Document,
                Type
            }).returning('Id').then(Id => insertedId = Id[0]);
        }
        catch (err) {
            //duplicate field
            console.log(String(err));
            if (String(err).includes('UNIQUE constraint failed:')) {
                if (String(err).includes('user.Login')) {
                    return response.json({ status: 204, errors: ["Login already exists!"] });
                }
            }
        }
        return response.json({ status: 201,User_ID:insertedId });
    },

    async login(request, response) {
        const { Login, Password } = request.body;

        const loggedUser = await connection('user').where('Login', Login).select('*').first();
        
        if (loggedUser !== undefined && cryptography.verifyPassword(Password, loggedUser.Password)) {

            const createdToken = tokenHelper.generateToken(loggedUser.Id, loggedUser.Login, loggedUser.Name);

            loggedUser.Password = "";

            return response.json({
                auth: true,
                token: createdToken,
                userInformation: loggedUser
            });
        }
        else {
            return response.status(500).json({ message: 'Login and Password do not match!' });
        }
    },
    async uploadUserImg(request,response){
        const userId = request.body.User_ID;
        const user = await connection('user').where('Id',userId).update({ProfileImageUrl:`/public/user/${userId}/${request.file.originalname}`});
        connection('user').update(user);
    }
};