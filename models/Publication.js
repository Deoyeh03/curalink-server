const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
  doi: { type: String, unique: true },
  title: String,
  journal: String,
  authors: [String],
  abstract: String,
  aiSummary: String,
});

module.exports = mongoose.model('Publication', PublicationSchema);
