const express = require('express')
const app = express()
const PORT = 3000
const routes = require('./routes')
const { client, populateData } = require('./elastic')
app.use(routes)
client.ping({ requestTimeout: 3000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!')
  } else {
    console.log('Successfully connected')
  }
})
populateData()
app.listen((PORT), () => {
  console.log('server is connected')
})