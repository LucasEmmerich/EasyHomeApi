const tokenHandler = require('../handlers/tokenHandler');
const propertyService = require('../database/services/PropertyService');

module.exports = {
    async createProperty(request, response, errorHandler) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType, Id } = request.body;

            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);

            const insertedId = await propertyService.saveProperty(Id , Address, AreaJsonConfig, Type, Informations, Description, SaleType, userInfo.Id);

            return response.status(201).json({
                Property_ID: insertedId
            });
        }
        catch (err) {
            errorHandler(err);
        }
    },

    async updateProperty(request, response, errorHandler) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType, Id } = request.body;

            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);

            const updatedId = await propertyService.saveProperty(Id, Address, AreaJsonConfig, Type, Informations, Description, SaleType, userInfo.Id);
            
            return response.status(200).json({
                Property_ID: updatedId
            });
        }
        catch (err) {
            errorHandler(err);
        }
    },

    async listPropertyByUser(request, response, errorHandler) {
        try {
            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);
            const properties = await propertyService.listPropertyByUser(userInfo.Id);

            return response.status(200).json(properties);
        }
        catch (err) {
            errorHandler(err);
        }
    },

    async listAllProperties(request, response, errorHandler) {
        try {
            const filteredTypes = request.query.Types.split(',');
            const filteredSaleTypes = request.query.SaleTypes.split(',');
            
            const properties = await propertyService.listAllProperties(filteredTypes, filteredSaleTypes);

            return response.status(200).json(properties);
        }
        catch (err) {
            errorHandler(err);
        }
    },

    async deleteProperty(request, response, errorHandler) {
        try {
            const { id } = request.params;

            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);

            await propertyService.deleteProperty(id, userInfo.Id);

            return response.status(200).send('OK');
        }
        catch (err) {
            errorHandler(err);
        }
    },

    async uploadPropertyImages(request, response, errorHandler) {
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

            return response.status(200).send('OK');
        }
        catch (err) {
            errorHandler(err);
        }
    }
};