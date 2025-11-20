'use strict';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Attractions = sequelize.define("Attractions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeExposition: {
            type: DataTypes.TIME,
            allowNull: false
        },
        hasLimit: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        limitPeople: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        locationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
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
        tableName: 'attractions',
        timestamps: true
    });

    Attractions.associate = (models) => {
        Attractions.belongsTo(models.Locations, {
            foreignKey: 'locationId',
            as: 'location'
        });
    };

    Attractions.registerAssociations = function (models) {
        if (typeof Attractions.associate === 'function') {
            Attractions.associate(models);
        }
    };

    return Attractions;
};