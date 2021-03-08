const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL.replace('USER', process.env.MONGO_USER).replace('PASS', process.env.MONGO_PASS), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, err => {
  if (err) return console.log('ERROR: ', err)
  console.log('Connected to database...')
})

const verifyToken = require('./middleware/verifyToken')
const verifyAdmin = require('./middleware/verifyAdmin')

app.use(require('cors')())
app.use(require('morgan')('short'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/api/admin', verifyToken, verifyAdmin, require('./routers/admin'))
app.use('/api/auth', require('./routers/auth'))
app.use('/api/movie', verifyToken, require('./routers/movie'))
app.use('/api/player', verifyToken, require('./routers/player'))
app.use('/api/user', verifyToken, require('./routers/user'))

app.listen(8080, () => {
  console.log('API is listening on PORT 8080...')
})
