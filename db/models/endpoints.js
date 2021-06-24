"use strict";
/**
 * Options model
 * @class Options
 */
 module.exports = function (sequelize, DataTypes) {
  const Endpoints = sequelize.define('endpoints', {

     id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER,
      },
      path: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull:false,
        type: DataTypes.STRING,
      },
      method: {
        allowNull:false,
        type: DataTypes.STRING,
      }
  },{

   timestamps: true,
   paranoid: false,
   underscored: true,
   freezeTableName: true,
});

  return Endpoints;
}
