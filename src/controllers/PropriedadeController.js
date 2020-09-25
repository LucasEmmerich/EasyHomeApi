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

        let insertedId = Number();

        await connection('propriedade').insert({
            Descricao,
            Endereco,
            AreaJsonConfig: JSON.stringify(AreaJsonConfig),
            Tipo,
            Informacoes,
            Usuario_ID: userInfo.Id
        }).returning('Id').then(Id => insertedId = Id[0]);

        return response.json({
            StatusCode: 201,
            Propriedade_ID: insertedId
        });
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
        const propriedades = await connection('propriedade')
            .innerJoin('usuario', 'propriedade.Usuario_ID', 'usuario.Id')
            .select(
                'propriedade.*',
                'usuario.Nome as NomeUsuario',
                'usuario.Contato as ContatoUsuario',
                'usuario.Email as EmailUsuario',
                'usuario.Tipo as TipoUsuario'
            );

        let images = await connection('imagens_propriedade').select('*');

        for (let item of propriedades) {
            let imgs = [];
            images.forEach(function (x) {
                if (item.Id == x.Propriedade_ID) {
                    imgs.push(x.ImageUrl);
                    return true;
                }
            });
            item.Images = imgs;
        }
        
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
    },

    async uploadPropriedadeImagens(request, response) {
        const propId = request.body.Propriedade_ID;
        const images = [];
        for (const img of request.files) {
            images.push({
                ImageFileName: img.originalname,
                ImageUrl: `/public/propriedades/${propId}/${img.originalname}`,
                Propriedade_ID: propId
            })
        }

        await connection('imagens_propriedade').insert(images);
    }

};