const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Movie = require('../models/movie')
const User = require('../models/user')
const Manifest = require('../models/manifest')

router.get('/getWatching/:id', (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) return res.json({ url: req.url, status: 'error', msg: 'Error finding user', error: err })
    if (!user) return res.json({ url: req.url, status: 'fail', msg: 'No user found' })
    Movie.findOne({ publicid: req.params.id }, (err, movie) => {
      if (err) return res.json({ url: req.url, status: 'error', msg: 'Error finding movie', error: err })
      if (!movie) return res.json({ url: req.url, status: 'fail', msg: 'No movie found with id' })
      let sendTime = 0
      let foundWatching = user.content.watching.find(x => x.movie.toString() == movie._id)
      if (foundWatching) {
        sendTime = foundWatching.time
      }

      res.json({ url: req.url, status: 'success', msg: 'Found current progress', data: sendTime })
    })
  })
})

router.post('/addWatching/:id', async (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate('content.watching.movie')
    .exec((err, user) => {
      Movie.findOne({ publicid: req.params.id }, (err, content) => {
        if (err) return res.json({ msg: 'error' })
        if (user.content.watching.find(x => x.movie._id.toString() == content._id)) {
          user.content.watching.find(x => x.movie._id.toString() == content._id).time = req.body.time
        } else {
          user.content.watching.push({
            movie: mongoose.Types.ObjectId(content._id),
            time: req.body.time
          })
        }
        User.updateOne({ _id: user._id }, { 'content.watching': user.content.watching }, (err, raw) => {
          res.json({ msg: 'success' })
        })
      })
    })
})

router.get('/getManifest/:id', (req, res) => {
  Manifest.findOne({ mediaId: req.params.id }, (err, manifest) => {
    if (err) return res.json({ url: req.url, status: 'error', msg: 'Error finding manifest', error: err })
    if (!manifest) return res.json({ url: req.url, status: 'fail', msg: 'No manifest found with id' })
    res.json({ url: req.url, status: 'success', msg: 'Found manifest', data: manifest })
  })
})

router.get('/getPrefs/', (req, res) => {
  res.json({ url: req.url, status: 'success', msg: 'Found preferances', data: req.user.prefs })
})

router.post('/setPref/', (req, res) => {
  User.updateOne({ _id: req.user._id }, { prefs: JSON.parse(req.body.userPrefs) }, (err, resp) => {
    if (err) return res.json({ url: req.url, status: 'error', msg: 'Error updating user prefs', error: err })
    res.json({ url: req.url, status: 'success', msg: 'Updated user prefs', data: req.body.userPrefs })
  })
})

module.exports = router