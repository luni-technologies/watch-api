const mongoose = require('mongoose')

const manifestSchema = new mongoose.Schema({
  publicid: {
    type: String
  },
  media_type: {
    type: String
  },
  mediaTitle: {
    type: String
  },
  video: {
    src: {
      type: String
    },
    lang: {
      type: String
    },
    skips: [
      {
        from: {
          type: Number
        },
        to: {
          type: Number
        }
      }
    ],
    end: {
      type: Number
    }
  },
  subtitles: [
    {
      src: {
        type: String
      },
      lang: {
        type: String
      },
      langid: {
        type: String
      }
    }
  ]
})

module.exports = mongoose.model('Manifest', manifestSchema)