const elasticsearch = require('elasticsearch')
const axios = require('axios')
const express = require('express')
const app = express()
const PORT = 3000
const routes = require('./routes')
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
})

client.ping({ requestTimeout: 3000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!')
  } else {
    console.log('Successfully connected')
  }
})

app.use(routes)
const initIndex = (indexName) => {
  return client.indices.create({
    index: indexName
  })
}

const indexExists = (indexName) => {
  return client.indices.exists({
    index: indexName
  })
}

const deleteIndex = (indexName) => {
  return client.indices.delete({
    index: indexName
  })
}

indexExists('search-cities')
  .then((exists) => {
    if (exists) {
      return deleteIndex('search-cities')
    }
  })
  .then((exists) => {
    return initIndex('search-cities')
  })
  .then((exists) => {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/cities'
    })
      .then(({ data }) => {
        data.forEach(city => {
          bulk.push({
            index: {
              _index: "search-cities",
              _type: "cities_list",
            }
          })
          bulk.push(city)
        })
        client.bulk({ body: bulk }, function (err, response) {
          if (err) {
            console.log("Failed Bulk operation", err)
          } else {
            console.log("Successfully imported %s", data.length)
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
  .catch(err => {
    console.log(err)
  })
const bulk = []



app.get('/cities/search/elastic', function (req, res) {
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
      console.log(err)
      res.send([])
    })
})

app.listen((PORT), () => {
  console.log('server is connected')
})