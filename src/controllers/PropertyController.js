const connection = require('../database/connection');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async createProperty(request, response) {
        const { Address, AreaJsonConfig, Type, Informations, Description } = request.body;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        let insertedId = Number();
        
        await connection('property').insert({
            Description,
            Address,
            AreaJsonConfig: JSON.stringify(AreaJsonConfig),
            Type,
            Informations,
            User_ID: userInfo.Id
        }).returning('Id').then(Id => insertedId = Id[0]);

        return response.json({
            StatusCode: 201,
            Property_ID: insertedId
        });
    },

    async listPropertyByUser(request, response) {
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        const properties = await connection('property').where('User_ID', userInfo.Id).select('*');

        return response.json(properties);
    },

    async listAllProperties(request, response) {
        const properties = await connection('property')
            .innerJoin('user', 'property.User_ID', 'user.Id')
            .select(
                'property.*',
                'user.Name as UserName',
                'user.Contact as UserContact',
                'user.Email as UserEmail',
                'user.Type as UserType',
                'user.Id as UserID'
            );

        let images = await connection('property_images').select('*');

        for (let item of properties) {
            let imgs = [];
            images.forEach(function (x) {
                if (item.Id == x.Propriedade_ID) {
                    imgs.push(x.ImageUrl);
                    return true;
                }
            });
            item.Images = imgs;
        }
        
        return response.json(properties);
    },

    async updateProperty(request, response) {
        const { Address, AreaJsonConfig, Type, Informations, Description, Id } = request.body;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }

        await connection('property')
            .where('Id', Id)
            .update({
                Description,
                Address,
                AreaJsonConfig: JSON.stringify(AreaJsonConfig),
                Type,
                Informations,
                User_ID: userInfo.Id
            });

        return response.json('200');
    },

    async deleteProperty(request, response) {
        const { id } = request.params;
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, message: 'Unauthorized' })
        }

        const property = await connection('property').where('Id', Number(id)).delete();
        if(property.User_ID != userInfo.Id){
            return response.json({ status: 401, message: 'Unauthorized' })
        }

        return response.json('200');
    },

    async uploadPropertyImages(request, response) {
        const propId = request.body.Property_ID;
        
        const images = [];
        for (const img of request.files) {
            images.push({
                ImageUrl: `/public/properties/${propId}/${img.originalname}`,
                Property_ID: propId
            })
        }
        await connection('property_images').insert(images);
    }

};