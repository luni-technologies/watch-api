const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  publicid: {
    type: String
  },
  meta: {
    title: {
      main: {
        type: String
      },
      alternatives: [String]
    },
    plot: {
      type: String
    },
    storyline: {
      type: String
    },
    ratings: {
      imdb: {
        number: {
          type: String
        },
        url: {
          type: String
        }
      },
      rotten: {
        number: {
          type: String
        },
        url: {
          type: String
        }
      }
    },
    released: {
      day: {
        type: String
      },
      month_num: {
        type: String
      },
      month: {
        type: String
      },
      year: {
        type: String
      }
    },
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Genre'
      }
    ],
    age_rating: {
      type: mongoose.Types.ObjectId,
      ref: 'Rating'
    },
    keywords: [String],
    technical: {
      sound_mix: [String],
      color: {
        type: String
      },
      aspect_ratio: {
        type: String
      },
      cameras: [String],
      lens: [String],
      runtime: {
        type: String
      },
      laboratories: [String],
      negative: {
        type: String
      },
      processes: [String],
      printed: {
        type: String
      }
    }
  },
  cast: [
    {
      person: {
        type: mongoose.Types.ObjectId,
        ref: 'Person'
      },
      role: {
        type: String
      }
    }
  ]
})

module.exports = mongoose.model('Movie', movieSchema)