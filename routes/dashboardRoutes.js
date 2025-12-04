const express = require('express');
const { getPersonalizedData } = require('../controllers/dashboardController');
const { globalSearch } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPersonalizedData);
router.get('/search', protect, globalSearch);

module.exports = router;
