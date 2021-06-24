"use strict";

module.exports = function (sequelize, DataTypes) {
  const workspaces = sequelize.define('workspaces', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull:false,  
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,  
      },
      website: {
        type: DataTypes.STRING,
        allowNull:false,  
      },
      size: {
        type: DataTypes.STRING,
        allowNull:true,  
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull:false,  
      }

  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        workspaces.belongsTo(models.users, {foreignKey: 'created_by'}); 
      }
    }
  });

  return workspaces;
}
