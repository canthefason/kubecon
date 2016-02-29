var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var fs = require('fs')

var app = require('express')()
var bodyParser = require('body-parser')
var port = 3000

var compiler = webpack(config)
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


app.post('/todo', function(req, res) {
  fs.readFile('todos.txt', 'utf8', function(err, data){
    if (err) console.log(err)
    if (data.length > 0) {
      data = JSON.parse(data)
      data.push(req.body)
    }else{
      data = [req.body]
    }
    fs.writeFile('todos.txt', JSON.stringify(data), 'utf8', function(err){
      if (err) console.log(err)
      res.json({body: req.body})
    })
  })
})

app.get('/todo', function(req, res) {
  fs.readFile('todos.txt', 'utf8', function(err, data){
    if (err) console.log(err)
    if (data.length > 0) {
      data = JSON.parse(data)
    } else {
      data = []
    }
    res.json(data)
  })
})
app.put('/todo', function(req, res) {
  fs.readFile('todos.txt', 'utf8', function(err, data){
    if (err) console.log(err)
    data = JSON.parse(data)
    data = data.map(todo => req.body.id === todo.id ? req.body : todo)

    fs.writeFile('todos.txt', JSON.stringify(data), 'utf8', function(err){
      if (err) console.log(err)
      res.json({body: req.body})
    })
  })
})


app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
