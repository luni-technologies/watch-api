const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Movie = require('../models/movie')
const User = require('../models/user')

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

    User.updateOne({_id: req.user._id}, {'content.watching': req.user.content.watching}, (err, resp) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error updating user progress', error: err})
      res.json({url: req.url, status: 'success', msg: 'Set current progress', data: req.body.currentTime})
    })
  })
})

module.exports = router