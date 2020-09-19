const connection = require('../database/connection');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async createPropriedade(request, response) {
        const { Endereco, AreaJsonConfig, Tipo, Informacoes, Descricao } = request.body;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        let insertedId;

        await connection('propriedade').insert({
            Descricao,
            Endereco,
            AreaJsonConfig: JSON.stringify(AreaJsonConfig),
            Tipo,
            Informacoes,
            Usuario_ID: userInfo.Id
        });

        // connection.transaction(async (transaction) => {
        //     await connection('propriedade').insert({
        //         Descricao,
        //         Endereco,
        //         AreaJsonConfig: JSON.stringify(AreaJsonConfig),
        //         Tipo,
        //         Informacoes,
        //         Usuario_ID: userInfo.Id
        //     })
        //     .returning('Id')
        //     .then(Id => {
        //         insertedId = Id[0];
        //     });
        //     transaction.commit();
        // })

        return response.json('201');
    },

    async listPropriedadeByUser(request, response) {
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        const propriedades = await connection('propriedade').where('Usuario_ID', userInfo.Id).select('*');

        return response.json(propriedades);
    },

    async listAllPropriedades(request, response) {
        const propriedades = await connection('propriedade').select('*');
        return response.json(propriedades);
    },

    async updatePropriedade(request, response) {

        const { Endereco, AreaJsonConfig, Tipo, Informacoes, Descricao, Id } = request.body;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        await connection('propriedade')
            .where('Id', Id)
            .update({
                Descricao,
                Endereco,
                AreaJsonConfig: JSON.stringify(AreaJsonConfig),
                Tipo,
                Informacoes,
                Usuario_ID: userInfo.Id
            });

        return response.json('200');
    },

    async deletePropriedade(request, response) {
        const { id } = request.params;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        await connection('propriedade').where('Id', Number(id)).delete();

        return response.json('200');
    }

};