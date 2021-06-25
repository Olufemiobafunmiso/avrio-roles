"use strict";
/**
 * Options model
 * @class Options
 */
 module.exports = function (sequelize, DataTypes) {
  const endpoints = sequelize.define('endpoints', {

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
  //  underscored: true,
  //  freezeTableName: true,
   classMethods: {
    associate: function (models) {
      // .belongsTo(models.users, {foreignKey: 'createrolesd_by_id'});
      endpoints.belongsToMany(models.roles, {
        through: 'roles_endpoints',
        // foreignKey: 'endpoint_id',
        // otherKey:'roles_id'
      });
      }
  }
});

  return endpoints;
}
