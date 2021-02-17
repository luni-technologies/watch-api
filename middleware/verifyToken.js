const jwt = require('jsonwebtoken')

function verify(req, res, next) {
  const token = req.header("auth-token")
  if (!token) return res.status(401).json({url: req.url, status: 'fail', msg: 'Access Denied'})
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({url: req.url, status: 'error', msg: 'Invalid token', error: err})
  }
}

module.exports = verify