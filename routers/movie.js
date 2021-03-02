const express = require('express')
const router = express.Router()
const axios = require('axios').default
const cheerio = require('cheerio')
const uuid = require('uuid')

const Movie = require('../models/movie')
const Manifest = require('../models/manifest')

const verifyAdmin = require('../middleware/verifyAdmin')

function addDays(originDate, days) {
  var date = new Date(originDate.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

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