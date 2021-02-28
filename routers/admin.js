const express = require('express')
const router = express.Router()

router.get('/pingAdmin', (req, res) => {
  res.json({url: req.url, status: 'success', msg: 'Pong'})
})

module.exports = router