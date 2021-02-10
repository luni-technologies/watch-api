const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  publicid: {
    type: String
  },
  url: {
    type: String
  },
  meta: {
    name: {
      type: String
    },
    bio: {
      text: {
        type: String
      },
      source: {
        url: {
          type: String
        },
        text: {
          type: String
        }
      }
    }
  },
  content: [
    {
      title: {
        type: String
      },
      movies: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        }
      ]
    }
  ]
})

module.exports = mongoose.model('Person', personSchema)