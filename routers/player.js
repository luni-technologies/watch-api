const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Movie = require('../models/movie')
const User = require('../models/user')
const Manifest = require('../models/manifest')

router.get('/getWatching/:id', (req, res) => {
  Movie.findOne({publicid: req.params.id}, (err, movie) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding movie', error: err})
    if (!movie) return res.json({url: req.url, status: 'fail', msg: 'No movie found with id'})
    let sendTime = 0
    let foundWatching = req.user.content.watching.find(x => x.movie === mongoose.Types.ObjectId(movie._id))
    if (foundWatching) {
      sendTime = foundWatching.time
    }

    res.json({url: req.url, status: 'success', msg: 'Found current progress', data: sendTime})
  })
})

router.post('/addWatching/:id', (req, res) => {
  Movie.findOne({publicid: req.params.id}, (err, movie) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding movie', error: err})
    if (!movie) return res.json({url: req.url, status: 'fail', msg: 'No movie found with id'})
    let foundWatching = req.user.content.watching.find(x => x.movie === mongoose.Types.ObjectId(movie._id))
    if (foundWatching) {
      foundWatching.time = req.body.currentTime
    } else {
      req.user.content.watching.push({
        movie: mongoose.Types.ObjectId(movie._id),
        time: req.body.currentTime
      })
    }

    if (req.user.content['watch_history'][req.user.content['watch_history'].length - 1].movie !== mongoose.Types.ObjectId(movie._id)) {
      req.user.content['watch_history'].push({
        movie: mongoose.Types.ObjectId(movie._id),
        at: new Date()
      })
    }

    User.updateOne({_id: req.user._id}, {content: req.user.content}, (err, resp) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error updating user progress', error: err})
      res.json({url: req.url, status: 'success', msg: 'Set current progress', data: req.body.currentTime})
    })
  })
})

router.get('/getManifest/:id', (req, res) => {
  Manifest.findOne({mediaId: req.params.id}, (err, manifest) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding manifest', error: err})
    if (!manifest) return res.json({url: req.url, status: 'fail', msg: 'No manifest found with id'})
    res.json({url: req.url, status: 'success', msg: 'Found manifest', data: manifest})
  })
})

module.exports = router