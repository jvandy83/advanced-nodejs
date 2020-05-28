const mongoose = require('mongoose');
const User = mongoose.model('User');

mongoose.Promise = global.Promise;
module.exports = async () => {
  return new User({}).save();
};
