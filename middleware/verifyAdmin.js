function verify(req, res, next) {
  let user = req.user
  if (user.info.isAdmin) {
    next()
  } else {
    res.status(400).json({url: req.url, status: 'error', msg: 'Not admin'})
  }
}

module.exports = verify