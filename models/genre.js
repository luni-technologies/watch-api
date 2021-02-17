const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  publicid: String,
  url: String,
  meta: {
    title: String,
    desc: String
  },
  content: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    }
  ]
})