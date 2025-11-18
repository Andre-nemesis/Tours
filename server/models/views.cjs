'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class views extends Model {
        static associate(models) {
            views.belongsTo(models.locations, { foreignKey: 'locationId', as: 'views' });
        }
    }
    views.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contentType: {
            type: DataTypes.ENUM('.mp3', '.jpg', '.mp4', '.wav', '.png', '.jpeg', '.gif'),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        locationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'locations',
                key: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            }
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
        modelName: 'views',
        tableName: 'views',
        timestamps: true
    });
    return views;
};