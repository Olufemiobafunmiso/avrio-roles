"use strict";
/**
 * Options model
 * @class Options
 */
 module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define('users', {

     id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER,
      },
      first_name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      auth_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      picture: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      verified: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      }
  },{

   timestamps: true,
   paranoid: false,
   underscored: true,
   freezeTableName: true,
});

  return Users;
}
