var express = require('express'),
  mongo = require('mongodb'),
  mongoose = require('mongoose'),
  imagePath = require('./routes/images'),
  searchPath = require('./routes/searches'),
  rootPath = require('./routes/root')
  app = express(),
  myUrl = process.env.MONGOLAB_URI,
  conn = mongoose.connection,
  options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.connect(myUrl, options);
app.use('/', rootPath);
app.use('/api/imagesearch', imagePath);
app.use('/api/latest/imagesearch', searchPath);
app.use(express.static( __dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  app.listen(process.env.PORT || 3000, function(){
    console.log('listening...');
  })
})

