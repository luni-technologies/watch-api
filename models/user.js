const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  publicid: String,
  info: {
    name: String,
    email: String,
    username: String,
    age: {
      born_on: Date
    },
    joined_at: Date
  },
  auth: {
    password: String
  },
  content: {
    watching: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        time: Number
      }
    ],
    watch_history: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        at: Date
      }
    ],
    watched: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        at: Date
      }
    ],
    ratings: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        value: Number
      }
    ],
  },
  social: {
    friends: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'User'
        },
        since: Date
      }
    ]
  },
  prefs: {
    subtitle: String
  }
})

module.exports = mongoose.model('User', userSchema)