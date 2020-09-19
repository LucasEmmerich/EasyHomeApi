const connection = require('../database/connection');
const tokenHandler = require('../helpers/tokenHelper')
const cryptography = require('../helpers/cryptographyHelper');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async createUser(request, response) {
        const { Nome, Login, Senha, Email, Contato, Documento,Tipo } = request.body;

        try {
            await connection('usuario').insert({
                Login,
                Senha: cryptography.encryptPasswd(Senha),
                Email,
                Contato,
                Nome,
                Documento,
                Tipo
            });
        }
        catch (err) {
            //duplicate field
            console.log(String(err));
            if (String(err).includes('UNIQUE constraint failed:')) {
                if (String(err).includes('usuario.Login')) {
                    return response.json({ errors: ["Login já Existente!"] });
                }
            }
        }
        return response.json({ status: 201 });
    },

    async listUser(request, response) { //just for tests or a future admin panel

        const usuarios = await connection('usuario').select('*');

        return response.json(usuarios);
    },

    async login(request, response) {
        const { Login, Senha } = request.body;

        const usuarioLogado = await connection('usuario').where('Login', Login).select('*').first();

        if (usuarioLogado !== undefined && cryptography.verifyPasswd(Senha, usuarioLogado.Senha)) {

            const createdToken = tokenHelper.generateToken(usuarioLogado.Id, usuarioLogado.Login, usuarioLogado.Nome);

            usuarioLogado.Senha = "";

            return response.json({
                auth: true,
                token: createdToken,
                userInformation: usuarioLogado
            });
        }
        else {
            return response.status(500).json({ message: 'Login inválido!' });
        }
    }

};