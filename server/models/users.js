'use strict';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Users = sequelize.define("Users", {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 255]
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
        tableName: 'users',
        timestamps: true
    });

    Users.associate = (models) => {
        Users.belongsTo(models.Locations, {
            foreignKey: 'userId',
            through: 'favoriteLocations',
            as: 'fvLocations'
        });
    };

    Users.registerAssociations = function (models) {
        if (typeof Users.associate === 'function') {
            Users.associate(models);
        }
    };

    return Users;
};