const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  publicid: String,
  url: String,
  meta: {
    name: String,
    bio: {
      text: String,
      source: {
        url: String,
        text: String
      }
    }
  },
  content: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    }
  ]
})

module.exports = mongoose.model('Person', personSchema)