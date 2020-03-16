const { City } = require('../models')
const { Op } = require('sequelize')

class CityController {
  static searchCity (req, res, next) {
    City.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.q}%`
        }
      }
    })
      .then(cities => {
        res.status(200).json(cities)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = CityController