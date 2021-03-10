const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Movie = require('../models/movie')
const User = require('../models/user')
const Manifest = require('../models/manifest')

router.get('/getWatching/:id', (req, res) => {
  User.findOne({_id: req.user._id}, (err, user) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding user', error: err})
    if (!user) return res.json({url: req.url, status: 'fail', msg: 'No user found'})
    Movie.findOne({publicid: req.params.id}, (err, movie) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding movie', error: err})
      if (!movie) return res.json({url: req.url, status: 'fail', msg: 'No movie found with id'})
      let sendTime = 0
      let foundWatching = user.content.watching.find(x => x.movie.toString() == movie._id)
      if (foundWatching) {
        sendTime = foundWatching.time
      }

      res.json({url: req.url, status: 'success', msg: 'Found current progress', data: sendTime})
    })
  })
})

router.post('/addWatching/:id', (req, res) => {
  Movie.findOne({publicid: req.params.id}, (err, movie) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding movie', error: err})
    if (!movie) return res.json({url: req.url, status: 'fail', msg: 'No movie found with id'})
    let foundWatching = req.user.content.watching.find(x => x.movie.toString() === movie._id)
    if (foundWatching) {
      foundWatching.time = req.body.currentTime
    } else {
      req.user.content.watching.push({
        movie: mongoose.Types.ObjectId(movie._id),
        time: req.body.time
      })
    }

    if (req.user.content['watch_history'].length === 0 || req.user.content['watch_history'][req.user.content['watch_history'].length - 1].movie !== mongoose.Types.ObjectId(movie._id)) {
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

router.post('/addWatched/:id', (req, res) => {
  Movie.findOne({publicid: req.params.id}, (err, content) => {
    const index = req.user.content.watching.indexOf(req.user.content.watching.find(x => x.content == mongoose.Types.ObjectId(content._id)))
    req.user.content.watching.splice(index, 1)

    if (!req.user.content.watched.includes(content._id)) {
      req.user.content.watched.push(content._id)

      User.updateOne({_id: req.user._id}, {'content': req.user.content}, (err,raw) => {
        res.json({url: req.url, status: 'success', msg: 'Saved movie to watched', data: req.user.content})
      })
    } else {
      res.json({url: req.url, status: 'success', msg: 'Saved movie to watched', data: req.user.content})
    }
  })
})

router.get('/getManifest/:id', (req, res) => {
  Manifest.findOne({mediaId: req.params.id}, (err, manifest) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding manifest', error: err})
    if (!manifest) return res.json({url: req.url, status: 'fail', msg: 'No manifest found with id'})
    res.json({url: req.url, status: 'success', msg: 'Found manifest', data: manifest})
  })
})

router.get('/getPrefs/', (req, res) => {
  res.json({url: req.url, status: 'success', msg: 'Found preferances', data: req.user.prefs})
})

router.post('/setPref/', (req, res) => {
  User.updateOne({_id: req.user._id}, {prefs: JSON.parse(req.body.userPrefs)}, (err, resp) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error updating user prefs', error: err})
    res.json({url: req.url, status: 'success', msg: 'Updated user prefs', data: req.body.userPrefs})
  })
})

module.exports = router