'use strict';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const FavoriteLocation = sequelize.define("FavoriteLocation", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        locationId: {
            type: DataTypes.UUID,
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
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'favoriteLocations',
        timestamps: true
    });

    FavoriteLocation.favoritePlace = async function (userId, locationId) {
        if (!userId || !locationId) throw new Error('userId and locationId are required');
        const [record, created] = await FavoriteLocation.findOrCreate({
            where: { userId, locationId },
            defaults: { userId, locationId }
        });
        return { record, created };
    };

    FavoriteLocation.registerAssociations = function (models) {
        if (models.Users) {
            FavoriteLocation.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
        }
        if (models.Locations) {
            FavoriteLocation.belongsTo(models.Locations, { foreignKey: 'locationId', as: 'location' });
        }
    };

    return FavoriteLocation;
};
