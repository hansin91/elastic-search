const router = require('express').Router()
const CityController = require('../controllers/city')
router.get('/search', CityController.searchCity)
router.get('/search/elastic', CityController.searchCityUsingElastic)

module.exports = router