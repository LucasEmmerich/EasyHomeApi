module.exports = class Property {
    constructor(id, address, description, areaJsonConfig, type, saleType, informations, userId) {
        this._id = id;
        this._address = address;
        this._description = description;
        this._areaJsonConfig = areaJsonConfig;
        this._type = type;
        this._saleType = saleType;
        this._informations = informations;
        this._userId = userId;
        this._createdAt = new Date().toLocaleString('pt-BR');
    }
    getEntity() {
        return {
            Id: this._id,
            Address: this._address,
            Description: this._description,
            AreaJsonConfig: this._areaJsonConfig,
            Type: this._type,
            SaleType: this._saleType,
            Informations: this._informations,
            User_ID: this._userId,
            created_at: this._createdAt
        }
    }
    get valid() {
        if (this._address.length < 10 || this._address.length > 120)
            return false;
        if (this._description.length < 5 || this._description.length > 120)
            return false;
        if (!this._areaJsonConfig)
            return false;
        if (!this._type)
            return false;
        if (!this._saleType)
            return false;
        if (!this._saleType)
            return false;
        if (!this._userId)
            return false;

        return true;
    }
}
