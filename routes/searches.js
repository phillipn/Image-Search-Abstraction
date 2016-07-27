var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  db = require('../models/userSearches');

router.get('/', function(req, res){
  db.getSearches(function(err, docs){
    res.json(docs);
  });
})

module.exports = router;