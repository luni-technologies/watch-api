const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  publicid: {
    type: String,
    unique: true
  },
  url: {
    type: String,
    unique: true
  },
  availability: {
    date: Date,
    bool: Boolean
  },
  meta: {
    title: {
      main: String,
      alternatives: [String]
    },
    plot: String,
    storyline: String,
    ratings: {
      imdb: {
        number: Number,
        url: String
      },
      rotten: {
        number: Number,
        url: String
      }
    },
    released: Date,
    genres: [String],
    age_rating: {
      number: Number,
      for: [String]
    },
    keywords: [String],
    technical: {
      sound_mix: [String],
      color: String,
      aspect_ratio: String,
      cameras: [String],
      lenses: [String],
      runtime: Number
    }
  },
  cast: [
    {
      person: {
        type: mongoose.Types.ObjectId,
        ref: 'Person'
      },
      role: String
    }
  ]
})

module.exports = mongoose.model('Movie', movieSchema)