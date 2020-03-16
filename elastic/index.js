const { City } = require('../models')
const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
})

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

const populateData = () => {
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
      console.log(exists)
      City.findAll({})
        .then(cities => {
          const bulk = []
          cities.forEach(city => {
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
              console.log("Successfully imported %s", cities.length)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      // axios({
      //   method: 'GET',
      //   url: 'http://localhost:3000/cities'
      // })
      //   .then(({ data }) => {
      //     data.forEach(city => {
      //       bulk.push({
      //         index: {
      //           _index: "search-cities",
      //           _type: "cities_list",
      //         }
      //       })
      //       bulk.push(city)
      //     })
      //     client.bulk({ body: bulk }, function (err, response) {
      //       if (err) {
      //         console.log("Failed Bulk operation", err)
      //       } else {
      //         console.log("Successfully imported %s", data.length)
      //       }
      //     })
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    })
    .catch(err => {
      console.log(err)
    })
}



module.exports = {
  client,
  initIndex,
  indexExists,
  deleteIndex,
  populateData
}
