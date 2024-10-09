const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  mobileNumber: { type: String, unique: true },
});

module.exports = mongoose.model('User', UserSchema);
