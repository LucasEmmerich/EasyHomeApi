const tokenHandler = require('../handlers/tokenHandler');
const propertyService = require('../database/services/PropertyService');
const Property = require('../model/Property');
const InvalidModelError = require('../errors/InvalidModelError');

module.exports = {
    async createProperty(request, response, errorHandler) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType } = request.body;
            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);
            const property = new Property(
                undefined,
                Address,
                Description,
                AreaJsonConfig,
                Type,
                SaleType,
                Informations,
                userInfo.Id
            );


            if(property.valid){
                const id = await propertyService.saveProperty(property.getEntity());

                return response.status(201).json({
                    Property_ID: id
                });
            } 
            else throw new InvalidModelError();
        }
        catch (err) {
            errorHandler(err);
        }
    },
    async updateProperty(request, response, errorHandler) {
        try {
            const { Address, AreaJsonConfig, Type, Informations, Description, SaleType, Id } = request.body;
            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);
            const property = new Property(
                Id,
                Address,
                Description,
                AreaJsonConfig,
                Type,
                SaleType,
                Informations,
                userInfo.Id
            );

            if(Id && property.valid){
                const id = await propertyService.saveProperty(property.getEntity());

                return response.status(200).json({
                    Property_ID: id
                });
            } 
            else throw new InvalidModelError();
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
            const filteredTypes = request.query.Types == undefined ? 
            [] 
            : 
            request.query.Types.split(',');

            const filteredSaleTypes = request.query.SaleTypes == undefined ? 
            [] 
            : 
            request.query.SaleTypes.split(',');

            const properties = await propertyService.listAllProperties(filteredTypes, filteredSaleTypes);

            return response.status(200).json(properties);
        }
        catch (err) {
            errorHandler(err);
        }
    },
    async deleteProperty(request, response, errorHandler) {
        try {
            const id = request.params.id;

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