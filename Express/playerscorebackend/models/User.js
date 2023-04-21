const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, required: true },
});

// tehdään UserSchemasta model
const User = mongoose.model('User', UserSchema);

module.exports = User;
