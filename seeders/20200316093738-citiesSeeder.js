'use strict'

const fs = require('fs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let { cities } = JSON.parse(fs.readFileSync('./data/db.json', { encoding: 'utf8' }))
    const data = []
    if (cities) {
      cities.forEach((city) => {
        data.push({
          country: city.country,
          name: city.name,
          lat: city.lat,
          lang: city.lng,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
      return queryInterface.bulkInsert('Cities', data, {})
    }
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Cities', null, {})
  }
}
