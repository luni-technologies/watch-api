const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(8080, () => {
  console.log('API is listening on PORT 8080...')
})