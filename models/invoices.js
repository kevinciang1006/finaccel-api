'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      invoices.hasMany(models.InvoiceDetails, {as: 'details'})
    }
  };
  invoices.init({
    invoice_number: DataTypes.STRING,
    invoice_date: DataTypes.DATE,
    customer_name: DataTypes.STRING,
    customer_address: DataTypes.STRING,
    customer_phone: DataTypes.STRING,
    tax: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'invoices',
  });
  return invoices;
};