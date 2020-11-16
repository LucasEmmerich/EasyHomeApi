const Knex = require('knex');
const connection = require('../connection');

module.exports = {
    async saveProperty(PropId, Address, AreaJsonConfig, Type, Informations, Description, SaleType, User_ID) {
        try {
            if (PropId) {
                const insertedId = await connection('property')
                    .where('Id', PropId)
                    .update({
                        Description: Description,
                        Address: Address,
                        AreaJsonConfig: JSON.stringify(AreaJsonConfig),
                        Type: Type,
                        Informations: Informations,
                        User_ID: User_ID,
                        SaleType: SaleType
                    }, 'Id');

                return insertedId;
            }
            else {
                const insertedId = await connection('property').insert({
                    Description: Description,
                    Address: Address,
                    AreaJsonConfig: JSON.stringify(AreaJsonConfig),
                    Type: Type,
                    Informations: Informations,
                    User_ID: User_ID,
                    SaleType: SaleType
                }, 'Id');

                return insertedId;
            }
        }
        catch (err) {
            return response.json({ status: 401, error: String(err) })
        }
    },

    async listPropertyByUser(User_ID) {
        try {

            const properties = await connection('property').where('User_ID', User_ID).select('*');

            const images = await this.getImagesProperties(properties.map((x) => { return x.Id; }))

            for (const prop of properties) {
                let propImgs = [];
                images.filter(x => {
                    if (x.Property_ID === prop.Id) {
                        propImgs.push(x.ImageUrl);
                        return true;
                    }
                });
                prop.Images = propImgs;
            }

            return properties;
        }
        catch (err) {
            throw err;
        }
    },

    async listAllProperties(filteredTypes, filteredSaleTypes) {
        try {
            const properties = await connection.raw(
                ' select user.FirstName || \' \' || user.LastName,' +
                ' property.*,' +
                ' user.Contact as UserContact,' +
                ' user.Email as UserEmail,' +
                ' user.Type as UserType,' +
                ' user.Id as UserID' +
                ' from property ' +
                ' join user on property.User_ID = user.Id' +
                ' where property.Type in (\'' + filteredTypes.join('\',\'') + '\')' +
                ' and property.SaleType in (\'' + filteredSaleTypes.join('\',\'') + '\')'
            );

            return properties;
        }
        catch (err) {
            throw err;
        }
    },

    async getImagesProperties(arrayPropIDs) {
        try{
            const images = await connection('property_images').whereIn('Property_ID', arrayPropIDs).select('*');
            return images.map(x => {
                return { ImageUrl: x.ImageUrl, Property_ID: x.Property_ID };
            });
        }
        catch(err){
            throw err;
        }
    },

    async deleteProperty(propID, User_ID) {
        try{
            await connection('property').where('User_ID', User_ID).where('Id', Number(propID)).delete();
        }
        catch(err){
            throw err;
        }
    },

    async uploadPropertyImages(images) {
        try{
            await connection('property_images').insert(images);
        }
        catch(err){
            throw err;
        }
    }

}