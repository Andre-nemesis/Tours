'use strict';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Locations = sequelize.define("Locations", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.JSON,
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qrCode: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'locations',
        timestamps: true
    });

    Locations.associate = (models) => {
        Locations.belongsToMany(models.Users, {
            foreignKey: 'locationId',
            through: 'favoriteLocations',
            as: 'fvLocations'
        });

        Locations.hasMany(models.Attractions, {
            foreignKey: 'locationId',
            as: 'attractions'
        });

        Locations.hasMany(models.Views, {
            foreignKey: 'locationId',
            as: 'views'
        });
    };

    Locations.registerAssociations = function (models) {
        if (typeof Locations.associate === 'function') {
            Locations.associate(models);
        }
    };

    return Locations;
};