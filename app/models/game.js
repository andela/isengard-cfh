/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

/**
 * Answer Schema
 */
const GameSchema = new Schema({
  id: {
    type: String
  },
  creatorId: {
    type: String,
  },
  playersIds: {
    type: [String]
  },
  winnerId: {
    type: String
  }
});

/**
 * Statics
 */
GameSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      id: id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Game', GameSchema);
