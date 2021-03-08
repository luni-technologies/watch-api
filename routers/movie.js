const express = require('express')
const router = express.Router()

const Movie = require('../models/movie')

router.get('/findById/:id', (req, res) => {
  Movie.findOne({publicid:req.params.id})
    .populate([{path:'cast.person'}])
    .then(movie => {
      res.json({url: req.url, status: 'success', msg: 'Successfully found a movie', movie})
    })
})

router.get('/findByUrl/:url', (req, res) => {
  Movie.findOne({url:req.params.url})
    .populate([{path:'cast.person'}])
    .then(movie => {
      res.json({url: req.url, status: 'success', msg: 'Successfully found a movie', movie})
    })
})

router.get('/findByQuery/:query', (req, res) => {
  Movie.find(JSON.parse(req.params.query))
    .populate([{path:'cast.person'}])
    .then(movies => { 
      res.json({url: req.url, status: 'success', msg: 'Successfully found movies', movies})
    })
})

module.exports = router