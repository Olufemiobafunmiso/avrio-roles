"use strict";

module.exports = function (sequelize, DataTypes) {
  const user_account_maps = sequelize.define('user_account_maps', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    is_owner: {
      type: DataTypes.BOOLEAN,
      allowNull:true, 
      default:0 
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'users',
        key: 'id'
    }
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'workspaces',
        key: 'id'
    }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull:false, 
      references: {
        model: 'roles',
        key: 'id'
    }
    }

  }, {
    paranoid: true,
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: function (models) {
        user_account_maps.belongsTo(models.users, {foreignKey: 'users_id'}); 
        user_account_maps.belongsTo(models.workspaces, {foreignKey: 'workspace_id'}); 
        user_account_maps.belongsTo(models.roles, {foreignKey: 'role_id'}); 
        
      }
    }
  });

  return user_account_maps;
}
