'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Favorite_list extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            Favorite_list.belongsTo(models.User, {
                foreignKey: 'uid',
                as: 'user'
            });
            Favorite_list.belongsTo(models.CoffeeShop, {
                foreignKey: 'cid',
                as: 'coffeeShop'
            });
        }
    }

    Favorite_list.init({
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        cid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    }, {
        sequelize,
        modelName: 'Favorite_list',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    return Favorite_list;
};