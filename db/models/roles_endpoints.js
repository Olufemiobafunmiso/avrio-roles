"use strict";

module.exports = function (sequelize, DataTypes) {
  const roles_endpoints = sequelize.define('roles_endpoints',{}, {
    // paranoid: true,
    timestamps: false,
    // underscored: true,
  });

  return roles_endpoints;
}
