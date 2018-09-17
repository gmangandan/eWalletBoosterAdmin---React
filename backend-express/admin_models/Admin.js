const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Admin = new Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true      
    },
    email: {
      type: String,
      unique: true,
      required: true      
    },
    password: {
      type: String,
      required: true      
    },
    mobileNumber: {
      type: String,
      required: false,
      unique: true
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

Admin.pre('save', function (next) {
  const admin = this;
  // only hash the password if it has been modified (or is new)
  if (!admin.isModified('password')) return next();
  // hash the password
  bcrypt.hash(admin.password, 10, function (err, hash) {    
    if (err) return next(err);      
    admin.password = hash;    
    next();
  });
});

Admin.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }   
    cb(null, isMatch);
  });
};
Admin.methods.generateHash = function(password){
  return  bcrypt.hashSync(password, 10);
}

module.exports = mongoose.model('admin', Admin);
