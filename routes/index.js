const router = require('express').Router()
const city = require('./city')
router.use('/cities', city)
module.exports = router