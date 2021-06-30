"use strict";


module.exports = function (sequelize, DataTypes) {
  const roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
        type: DataTypes.STRING,
        allowNull:true
      },
      workspaces_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: 'workspaces',
          key: 'id'
      }
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: 'users',
          key: 'id'
      }
      }

  }, {
    paranoid: true,
    timestamps: true,
    // underscored: true,
    classMethods: {
      associate: function (models) {
        // roles.belongsTo(models.users, {foreignKey: 'created_by_id'});
        // roles.belongsToMany(models.endpoints, {through:'roles_permissions'}); 
        roles.belongsToMany(models.endpoints, {
          through: 'roles_endpoints',
          // foreignKey: 'roles_id',
          // otherKey:'endpoint_id'
        });
      }
    }
  });

  return roles;
}
