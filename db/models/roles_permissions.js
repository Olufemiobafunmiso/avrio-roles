"use strict";

module.exports = function (sequelize, DataTypes) {
  const roles_permissions = sequelize.define('roles_permissions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roles_id: {
        type: DataTypes.INTEGER,
        allowNull:false,  
        references: {
          model: 'roles',
          key: 'id'
      }
      },
      endpoint_id: {
        type: DataTypes.INTEGER,
        allowNull:false,  
        references: {
          model: 'endpoints',
          key: 'id'
      }
      },

  }, {
    paranoid: true,
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: function (models) {
        roles_permissions.belongsTo(models.roles, {foreignKey: 'roles_id'});
        roles_permissions.belongsTo(models.endpoints,{foreignKey: 'endpoint_id'}); 
      }
    }
  });

  return roles_permissions;
}
