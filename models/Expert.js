const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: String,
  primaryAffiliation: String,
  specialties: [String],
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Expert', ExpertSchema);
