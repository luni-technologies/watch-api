const express = require('express')
const router = express.Router()
const axios = require('axios').default
const cheerio = require('cheerio')
const uuid = require('uuid')
const ObjectId = require('mongoose').Types.ObjectId

const Movie = require('../models/movie')
const Manifest = require('../models/manifest')
const Person = require('../models/person')

function addDays(originDate, days) {
  var date = new Date(originDate.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

router.get('/pingAdmin', (req, res) => {
  res.json({url: req.url, status: 'success', msg: 'Pong'})
})

router.post('/autoFind', async (req, res) => {
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

  let newMovie = new Movie(movieObj)
  newMovie.save().then(() => {
    console.log(movieObj.url + ' - saved')
    res.json({url: req.url, status: 'success', msg: 'Saved new title', data: movieObj})
  }).catch(e => {
    res.json({url: req.url, status: 'error', msg: 'Error saving new title', error: e})
  })
})

router.post('/create', (req, res) => {
  const movieObj = req.body.movie
  let newMovie = new Movie(movieObj)
  newMovie.save().then(() => {
    console.log(movieObj.url + ' - saved')
    res.json({url: req.url, status: 'success', msg: 'Saved new title', data: movieObj})
  }).catch(e => {
    res.json({url: req.url, status: 'error', msg: 'Error saving new title', error: e})
  })
})

router.post('/createManifest/:id', (req, res) => {
  let manifestObj = {
    publicid: uuid.v4(),
    media_type: req.body.mediaType,
    mediaId: req.params.id,
    mediaTitle: req.body.mediaTitle,
    video: {
      src: `/files/${req.params.id}/media/hls/playlist.m3u8`,
      lang: req.body.mediaLang,
      skips: req.body.skips,
      end: req.body.end
    },
    subtitles: req.body.subtitles
  }
  let newManifest = new Manifest(manifestObj)
  newManifest.save().then(() => {
    res.json({url: req.url, status: 'success', msg: 'Saved new manifest', data: manifestObj})
  }).catch(e => {
    res.json({url: req.url, status: 'error', msg: 'Error saving new manifest', error: e})
  })
})

module.exports = router