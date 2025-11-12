'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class attractions extends Model {
        static associate(models) {
            attractions.belongsTo(models.locations, { foreignKey: 'locationId', as: 'attractions' });
        }
    }
    attractions.init({
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
        timeExposition: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        hasLimit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        limitPeople: {
            type: DataTypes.INTEGER,
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
        modelName: 'attractions',
        tableName: 'attractions',
        timestamps: true
    });
    return attractions;
};