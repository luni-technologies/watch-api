const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  publicid: {
    type: String
  },
  info: {
    name: {
      type: String
    },
    email: {
      type: String
    },
    username: {
      type: String
    },
    age: {
      born_on: {
        type: Date
      }
    },
    joined_at: {
      type: Date
    }
  },
  auth: {
    password: {
      type: String
    }
  },
  content: {
    watching: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        time: {
          type: Number
        }
      }
    ],
    watch_history: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        at: {
          type: Date
        }
      }
    ],
    watched: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        at: {
          type: Date
        }
      }
    ],
    ratings: [
      {
        movie: {
          type: mongoose.Types.ObjectId,
          ref: 'Movie'
        },
        value: {
          type: Number
        }
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
        since: {
          type: Date
        }
      }
    ]
  },
  prefs: {
    subtitle: {
      type: String
    }
  }
})

module.exports = mongoose.model('User', userSchema)