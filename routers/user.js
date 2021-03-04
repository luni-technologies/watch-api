const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Movie = require('../models/movie')

router.get('/getWatchlist', (req, res) => {
  User.findOne({_id: req.user._id}, (err, doc) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error while getting user from db', error: err})
    res.json({url: req.url, status: 'success', msg: 'Got user\'s watchlist', data: doc})
  })
})

router.post('/addToWatchlist/:id', (req, res) => {
  Movie.findOne({publicid: req.body.id}, (err, movie) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error while getting movie from db', error: err})
    User.updateOne({_id: req.body._id}, {$push:{'content.watchlist':{movie:movie._id}}}, (err, resp) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error while updating user\'s watchlist', error: err})
      res.json({url: req.url, status: 'success', msg: 'Updated user\'s watchlist', data: movie})
    })
  })
})

router.get('/getAllWatching/', (req, res) => {
  User.findOne({_id: req.user._id})
    .populate('content.watching.movie')
    .exec((err, user) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error finding user', error: err})
      if (!user) return res.json({url: req.url, status: 'fail', msg: 'No user found'})
      res.json({url: req.url, status: 'success', msg: 'Found user\'s watching', data: user.content.watching})
    })
})

module.exports = router