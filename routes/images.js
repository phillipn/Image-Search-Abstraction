var express = require('express');
var router = express.Router();
var url = require('url');
var request = require('request');
var mongoose = require('mongoose');
var db = require('../models/userSearches');

router.get('/:term', function(req, res){
  var term = req.params.term;
  var urlParts = url.parse(req.url, true);
  var offset = urlParts.query.offset;
  var myKey = process.env.MYAPIKEY;
  
  db.logSearch({ searchTerm: term });
  
  function properUrl(){
    if(offset.match(/\d+/)){
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
      reduced[index] = { name: object.name, thumbnailPic: object.thumbnailUrl, largePic: object.contentUrl, hostPageUrl: object.hostPageUrl };
      return reduced;
    }, []));
  }
  
  request(options, callback);
  
})

module.exports = router;