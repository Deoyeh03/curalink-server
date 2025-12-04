const mongoose = require('mongoose');

const ClinicalTrialSchema = new mongoose.Schema({
  trialID: { type: String, unique: true, required: true },
  title: String,
  description: String,
  phase: String,
  status: String,
  aiSummary: String,
});

module.exports = mongoose.model('ClinicalTrial', ClinicalTrialSchema);
