const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3
  },
  secretcode: {type: String, required: true},
  checklist: {type: Array}
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;