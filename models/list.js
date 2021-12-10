const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  google_map: {
    type: String,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
  }
})

module.exports = mongoose.model('List', listSchema)