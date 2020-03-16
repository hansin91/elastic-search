const { City } = require('../models')
const { Op } = require('sequelize')
const { client } = require('../elastic')

class CityController {
  static searchCity (req, res, next) {
    City.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.query.q}%`
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

  static searchCityUsingElastic (req, res, next) {
    // declare the query object to search elastic search and return only 200 results from the first result found. 
    // also match any data where the name is like the query string sent in
    let body = {
      size: 200,
      from: 0,
      query: {
        match: {
          name: req.query['q']
        }
      }
    }
    // perform the actual search passing in the index, the search query and the type
    client.search({ index: 'search-cities', body: body, type: 'cities_list' })
      .then(results => {
        res.send(results.hits.hits)
      })
      .catch(err => {
        res.send([])
      })
  }
}

module.exports = CityController