const mongoose = require('mongoose')

const ageRatingSchema = new mongoose.Schema({
  publicid: String,
  url: String,
  meta: {
    title: String,
    meaning: String
  },
  content: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    }
  ]
})

module.exports = mongoose.model('Age Rating', ageRatingSchema)