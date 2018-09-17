const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Static = new Schema({
  static_text_for: {
    type: String,
    required: true
  },
  static_text_min_val: {
    type: Number,
    required: false
  },
  static_text_max_val: {
    type: Number,

    required: false
  },
  static_text: {
    type: String,

    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  },

});


module.exports = mongoose.model('turnover_static_text', Static);
