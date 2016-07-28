var express = require('express'),
    router = express.Router(),
    url = require('url'),
    request = require('request'),
    mongoose = require('mongoose'),
    db = require('../models/userSearches');

router.get('/:term', function(req, res){
  var term = req.params.term,
      urlParts = url.parse(req.url, true),
      offset = urlParts.query.offset,
      myKey = process.env.MYAPIKEY;
  
  db.logSearch({ searchTerm: term });
  
  function properUrl(){
    if(offset && offset.match(/\d+/)){
      return 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' 
      + term + '&count=10&offset=' + offset;
    } else {
      return 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' 
  + term + '&count=10';
    }
  }
    
  var options = {
    url: properUrl(),
    headers: {
      'Ocp-Apim-Subscription-Key': myKey
    }
  }

  function callback(error, response, body) {
    if(error){
      console.log(error);
    }
    body = JSON.parse(body).value;
    res.json(body.reduce(function(reduced, object, index){
      reduced[index] = { name: object.name, thumbnailPic: object.thumbnailUrl, largePic: object.contentUrl, hostPageUrl: object.hostPageDisplayUrl };
      return reduced;
    }, []));
  }
  
  request(options, callback);
  
})

module.exports = router;