const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const practiceSchema = new Schema({
  order: { type: Number },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  if_yes_advice: { type: String },
  if_no_advice: { type: String },
}, {
  timestamps: true,
});

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;