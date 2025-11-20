'use strict';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Views = sequelize.define("Views", {
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
        contentType: {
            type: DataTypes.ENUM('.mp3', '.jpg', '.mp4', '.wav', '.png', '.jpeg', '.gif'),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
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
        tableName: 'views',
        timestamps: true
    });

    Views.associate = (models) => {
        Views.belongsTo(models.Locations, {
            foreignKey: 'locationId',
            as: 'location'
        });
    };

    Views.registerAssociations = function(models) {
        if (typeof Views.associate === 'function') {
            Views.associate(models);
        }
    };

    return Views;
};