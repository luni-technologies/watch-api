const express = require('express')
const router = express.Router()

const Movie = require('../models/movie')

router.get('/findById/:id', (req, res) => {
  Movie.findOne({publicid:req.params.id})
    .populate([{path:'meta.genres'},{path:'meta.age_rating'},{path:'cast.person'}])
    .then(movie => {
      res.json({url: req.url, status: 'success', msg: 'Successfully found a movie', movie})
    })
})

router.get('/findByUrl/:url', (req, res) => {
  Movie.findOne({url:req.params.url})
    .populate([{path:'meta.genres'},{path:'meta.age_rating'},{path:'cast.person'}])
    .then(movie => {
      res.json({url: req.url, status: 'success', msg: 'Successfully found a movie', movie})
    })
})

module.exports = router