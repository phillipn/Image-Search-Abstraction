var mongoose = require('mongoose');

var Schema = mongoose.Schema(
  { searchTerm: String, when: { type: Date, required: true, default: Date.now }}, 
  { versionKey: false }
)

var Searches = module.exports = mongoose.model("ImageSearch", Schema);

module.exports = {
  getSearches: function(cb){
    Searches.find({}, cb).limit(10).sort({when: -1}).select({ searchTerm: 1, when: 1, _id: 0});
  },
  logSearch: function(criteria){
    Searches.create(criteria);
  }
}

