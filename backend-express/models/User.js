const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const User = new Schema({
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
      
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    countryCode: String,
    skrillEmail: String,
    netellerEmail: String,
    paypalEmail: String,
    accountName: String,
    sortCode: String,
    accountNo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

User.pre('save', function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // hash the password
  bcrypt.hash(user.password, 10, function (err, hash) {    
    if (err) return next(err);      
    user.password = hash;    
    next();
  });
});

User.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }   
    cb(null, isMatch);
  });
};
User.methods.generateHash = function(password){
  return  bcrypt.hashSync(password, 10);
}

module.exports = mongoose.model('user', User);
