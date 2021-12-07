const mongoose = require('mongoose')
const dataBase = mongoose.connection
const List = require('../list')
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

dataBase.on('error', () => {
  console.log('MongoDB error')
})

dataBase.once('open', () => {
  console.log('MongoDB connected')

  for (let i = 0; i < restaurantList.results.length; i++) {
    List.create({
      name: restaurantList.results[i].name,
      name_en: restaurantList.results[i].name_en,
      category: restaurantList.results[i].category,
      image: restaurantList.results[i].image,
      location: restaurantList.results[i].location,
      phone: restaurantList.results[i].phone,
      google_map: restaurantList.results[i].google_map,
      rating: restaurantList.results[i].rating,
      description: restaurantList.results[i].description
    })
  }

  console.log('done.')
})

