const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'researcher'],
    default: 'patient',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  patientProfile: {
    condition: String,
    conditionFilters: [String],
  },
  researcherProfile: {
    specialties: [String],
    researchInterests: [String],
    orcidID: String,
  },
  favorites: [
    {
      type: {
        type: String,
        enum: ['Trial', 'Expert'],
      },
      id: {
        type: mongoose.Schema.ObjectId,
        refPath: 'favorites.type',
      },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
