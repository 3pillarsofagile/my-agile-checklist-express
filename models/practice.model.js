const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const practiceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  if_yes_advice: { type: String, required: true },
  if_no_advice: { type: String, required: true },
}, {
  timestamps: true,
});

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;