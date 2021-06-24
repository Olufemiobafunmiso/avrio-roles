"use strict";

module.exports = function (sequelize, DataTypes) {
  const Invitations = sequelize.define('invitations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    }

  }, {
    paranoid: true,
    timestamps: true,
    classMethods: {
      associate: function (models) {
        Invitations.belongsTo(models.users, {foreignKey: 'users_id'}); 
        Invitations.belongsTo(models.roles, {foreignKey: 'roles'}); 
        Invitations.belongsTo(models.workspaces, {foreignKey: 'workspaces'}); 
      }
    }
  });

  return Invitations;
}
