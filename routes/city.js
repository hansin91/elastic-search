const router = require('express').Router()
const CityController = require('../controllers/city')
router.get('/search', CityController.searchCity)

module.exports = router