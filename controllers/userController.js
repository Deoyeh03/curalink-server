// User Controller - Handles user-related requests
const User = require('../models/User');
const { extractConditions } = require('../services/aiService');
const bcrypt = require('bcrypt');
const validator = require('validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken'); // Import jwt

// Utility function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const registerPatient = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // Added name

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    name, // Added name
    role: 'patient',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name, // Added name to response
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const onboardPatient = asyncHandler(async (req, res) => {
  console.log("Onboarding patient profile...");
  const { conditionText, location } = req.body;
  const userId = req.user._id; // Assuming user ID is available from auth middleware

  if (!conditionText || !location) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const condition = await extractConditions(conditionText);

  const user = await User.findById(userId);

  if (user) {
    user.location = location;
    user.patientProfile = {
      condition: condition[0],
      conditionFilters: condition,
    };
    await user.save();

    res.status(200).json({ message: "Patient profile onboarded", user: { _id: user._id, email: user.email, role: user.role, patientProfile: user.patientProfile, location: user.location } });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const registerResearcher = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    role: 'researcher',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const onboardResearcher = asyncHandler(async (req, res) => {
  console.log("Onboarding researcher profile...");
  const { orcidID, location, specialties, researchInterests } = req.body;
  const userId = req.user._id; // Assuming user ID is available from auth middleware

  // if (!location || !specialties) {
  //   res.status(400);
  //   throw new Error('Please enter all fields');
  // }

  const user = await User.findById(userId);

  if (user) {
    user.location = location;
    user.researcherProfile = {
      specialties,
      researchInterests,
      orcidID,
    };
    await user.save();

    res.status(200).json({ message: "Researcher profile onboarded", user: { _id: user._id, email: user.email, role: user.role, researcherProfile: user.researcherProfile, location: user.location } });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const detectLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    res.status(400);
    throw new Error('Please provide latitude and longitude');
  }
  res.status(200).json({ message: 'Location detected successfully', location: { latitude, longitude } });
});

module.exports = {
  registerPatient,
  onboardPatient,
  registerResearcher,
  onboardResearcher,
  detectLocation,
};
