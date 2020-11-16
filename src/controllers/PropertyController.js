const tokenHelper = require('../helpers/tokenHelper');
const propertyService = require('../database/services/PropertyService');

module.exports = {
    async createProperty(request, response) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType, Id } = request.body;

            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            const insertedId = await propertyService.saveProperty(Id , Address, AreaJsonConfig, Type, Informations, Description, SaleType, userInfo.Id);

            return response.status(201).json({
                Property_ID: insertedId
            });
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    },

    async updateProperty(request, response) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType, Id } = request.body;

            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            const updatedId = await propertyService.saveProperty(Id, Address, AreaJsonConfig, Type, Informations, Description, SaleType, userInfo.Id);
            
            return response.status(200).json({
                Property_ID: updatedId
            });
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    },

    async listPropertyByUser(request, response) {
        try {
            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
            const properties = await propertyService.listPropertyByUser(userInfo.Id);

            return response.json(properties);
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    },

    async listAllProperties(request, response) {
        try {
            const filteredTypes = request.query.Types.split(',');
            const filteredSaleTypes = request.query.SaleTypes.split(',');
            
            const properties = await propertyService.listAllProperties(filteredTypes, filteredSaleTypes);

            return response.json(properties);
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    },

    async deleteProperty(request, response) {
        try {
            const { id } = request.params;

            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            await propertyService.deleteProperty(id, userInfo.Id);

            return response.json({ status: 200 });
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    },

    async uploadPropertyImages(request, response) {
        try {
            const propId = request.body.Property_ID;
            const images = [];

            for (const img of request.files) {
                images.push({
                    ImageUrl: `/public/properties/${propId}/${img.originalname}`,
                    Property_ID: propId,
                    created_at: new Date().toLocaleString()
                })
            };

            await propertyService.uploadPropertyImages(images);

            return response.status(200);
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.status(401).json({ message: 'Unauthorized' });
            else return response.status(500).json({ message: 'Internal Error' })
        }
    }
};