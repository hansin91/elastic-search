'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    country: DataTypes.STRING,
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lang: DataTypes.DOUBLE
  }, {});
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};