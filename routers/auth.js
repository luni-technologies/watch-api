const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.post('/register', (req, res) => {
  User.findOne({$or: [{'info.email': req.body.email},{'info.username': req.body.username}]}, (err, doc) => {
    if (doc) return res.json({url: req.url, status: 'fail', msg: 'User already registered'})
    let userObj = {
      publicid: uuid.v4(),
      info: {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        age: {
          born_on: new Date(parseInt(req.body.bornYear), parseInt(req.body.bornMonth) - 1, parseInt(req.body.bornDay) + 1, 0, 0, 0, 0)
        },
        joined_at: new Date()
      },
      auth: {
        password: ''
      },
      content: {
        watching: [],
        watch_history: [],
        watched: [],
        ratings: []
      },
      social: {
        friends: []
      },
      prefs: {
        subtitle: 'off'
      }
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Problem generating password hash salt', error: err})
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.json({url: req.url, status: 'error', msg: 'Problem generating password hash', error: err})
        userObj.auth.password = hash
        let regUser = new User(userObj)
        regUser.save((err, saved) => {
          if (err) return res.json({url: req.url, status: 'error', msg: 'Problem saving the new user', error: err})
          res.json({url: req.url, status: 'success', msg: 'Saved new user', data: saved})
        })
      })
    })
  })
})

router.post('/login', (req, res) => {
  User.findOne({$or: [{'info.email':req.body.userident},{'info.username':req.body.userident}]}, (err, user) => {
    if (err) return res.json({url: req.url, status: 'error', msg: 'Error while finding user', error: err})
    if (!user) return res.json({url: req.url, status: 'fail', msg: 'User doesn\'t exist'})
    bcrypt.compare(req.body.password, user.auth.password, (err, isValid) => {
      if (err) return res.json({url: req.url, status: 'error', msg: 'Error while comparing hash to password', error: err})
      if (!isValid) return res.json({url: req.url, status: 'fail', msg: 'Invalid password'})

      const token = jwt.sign(
        user.toJSON(),
        process.env.JWT_SECRET
      )

      res.header('auth-token', token).json({url: req.url, status: 'success', msg: 'Successful login', data: token})
    })
  })
})

module.exports = router