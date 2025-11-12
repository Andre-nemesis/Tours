'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class locations extends Model {
    static associate(models) {
     locations.belongsToMany(models.users, { foreignKey: 'locationId', as: 'fvLocations', through: 'favoriteLocations' });
     locations.hasMany(models.attractions, { foreignKey: 'locationId', as: 'attractions' });
     locations.hasMany(models.views, { foreignKey: 'locationId', as: 'views' });
    }
  }
  locations.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'locations',
    tableName: 'locations',
    timestamps: true
  });
  return locations;
};