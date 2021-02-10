const mongoose = require('mongoose')

const manifestSchema = new mongoose.Schema({
  publicid: String,
  media_type: String,
  mediaTitle: String,
  video: {
    src: String,
    lang: String,
    skips: [
      {
        from: Number,
        to: Number,
        title: String
      }
    ],
    end: Number
  },
  subtitles: [
    {
      src: String,
      lang: String,
      langid: String
    }
  ]
})

module.exports = mongoose.model('Manifest', manifestSchema)