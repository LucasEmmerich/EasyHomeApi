const connection = require('../connection');

module.exports = {
    async saveProperty(property) {
        if (property.Id) {
            const id = await connection('property')
            .where('Id', property.Id).update(property,'Id');
            return id;
        }
        else {
            const id = await connection('property').insert(property).then(id=>id[0]);
            return id;
        }
    },
    async listPropertyByUser(User_ID) {
        const properties = await connection('property').where('User_ID', User_ID).select('*');
        const images = await this.getImagesProperties(properties.map((x) => x.Id))

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
    },
    async listAllProperties(filteredTypes, filteredSaleTypes) {
        const properties = await connection.raw(
            ' select user.FirstName || \' \' || user.LastName as UserName,' +
            ' property.Id,' +
            ' property.Address,' +
            ' property.Description,' +
            ' property.AreaJsonConfig,' +
            ' property.Type,' +
            ' property.SaleType,' +
            ' property.Informations,' +
            ' property.created_at,' +
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
    },
    async getImagesProperties(arrayPropIDs) {
        const images = await connection('property_images').whereIn('Property_ID', arrayPropIDs).select('*');
        return images.map(x => {
            return {
                ImageUrl: x.ImageUrl,
                Property_ID: x.Property_ID
            };
        });
    },
    async deleteProperty(propID, User_ID) {
        await connection('property').where('User_ID', User_ID).where('Id', Number(propID)).delete();
    },
    async uploadPropertyImages(images) {
        await connection('property_images').insert(images);
    }
}