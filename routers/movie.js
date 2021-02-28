const express = require('express')
const router = express.Router()
const axios = require('axios').default
const cheerio = require('cheerio')
const uuid = require('uuid')

const Movie = require('../models/movie')

const verifyAdmin = require('../middleware/verifyAdmin')

function addDays(originDate, days) {
  var date = new Date(originDate.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

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

router.post('/autoFind', verifyAdmin, async (req, res) => {
  let url = req.body.imdb
  let urlList = {
    home: url,
    release: url + 'releaseinfo',
    keywords: url + 'keywords'
  }
  let homeresp = await axios.get(urlList.home, {headers: {'Accept-Language': 'en-gb'}})
  let home$ = cheerio.load(homeresp.data)
  let releaseresp = await axios.get(urlList.release, {headers: {'Accept-Language': 'en-gb'}})
  let release$ = cheerio.load(releaseresp.data)
  let keywordsresp = await axios.get(urlList.keywords, {headers: {'Accept-Language': 'en-gb'}})
  let keywords$ = cheerio.load(keywordsresp.data)

  let movieObj = {
    publicid: uuid.v4(),
    url: home$('.title_wrapper h1').text().trim().split('(')[0].trim().toLowerCase().replace(/ /g, '-'),
    availability: {
      date: new Date(),
      bool: false
    },
    meta: {
      title: {
        main: home$('.title_wrapper h1').text().trim().split('(')[0].trim(),
        alternatives: []
      },
      plot: home$('.plot_summary .summary_text').text().trim(),
      storyline: home$('#titleStoryLine .inline.canwrap p span').text().trim(),
      ratings: {
        imdb: {
          number: parseFloat(home$('span[itemprop="ratingValue"]').text()),
          url: urlList.home
        }
      },
      released: addDays(new Date(release$('.release-date-item__date').eq(0).text()), 1),
      genres: home$('.subtext').text().split('|')[2].replace(/\n/g, '').trim().split(', '),
      keywords: keywords$('.sodatext').text().split('\n').map(x => x.trim()).filter(y => y !== '')
    },
    cast: []
  }
  res.json({url: req.url, status: 'success', msg: 'Auto found title on iMDB', data: movieObj})
})

router.post('/create', verifyAdmin, (req, res) => {
  const movieObj = req.body.movie
  let newMovie = new Movie(movieObj)
  newMovie.save().then(() => {
    console.log(movieObj.url + ' - saved')
    res.json({url: req.url, status: 'success', msg: 'Saved new title', data: movieObj})
  }).catch(e => {
    res.json({url: req.url, status: 'error', msg: 'Error saving new title', error: e})
  })
})

module.exports = router