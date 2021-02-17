const express = require('express')
const router = express.Router()

const Movie = require('../models/movie')

router.get('/findById/:id', (req, res) => {
  Movie.findOne({publicid:req.params.id})
    .populate([{path:'meta.genres'},{path:'meta.age_rating'},{path:'cast.person'}])
    .then(movie => {
      let respJSON
      respJSON = {url: req.url, status: 'success', msg: 'Successfully found a movie', movie}
      res.json(respJSON)
    })
})

router.get('/findByUrl/:url', (req, res) => {
  Movie.findOne({url:req.params.url})
    .populate([{path:'meta.genres'},{path:'meta.age_rating'},{path:'cast.person'}])
    .then(movie => {
      let respJSON
      respJSON = {url: req.url, status: 'success', msg: 'Successfully found a movie', movie}
      res.json(respJSON)
    })
})

router.post('/create', (req, res) => {
  let movieContent = JSON.parse(req.body.content)
  let movieDocument = new Movie(movieContent)
  movieDocument.save().then(savedDocument => {
    let respJSON = {url: req.url, status: 'success', msg: 'Successfully created a movie', movie:savedDocument}
    res.json(respJSON)
  })
})

module.exports = router