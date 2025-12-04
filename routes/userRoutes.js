const express = require('express');
const { detectLocation, onboardPatient, onboardResearcher } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

router.post('/location/detect', detectLocation);

// New routes for profile onboarding (protected)
router.put('/patient/onboard', protect, onboardPatient);
router.put('/researcher/onboard', protect, onboardResearcher);

module.exports = router;
