const express = require('express');
const { login } = require('../controllers/authController');
const { registerPatient, registerResearcher } = require('../controllers/userController');

const router = express.Router();

router.post('/login', login);
router.post('/register/patient', registerPatient);
router.post('/register/researcher', registerResearcher);


module.exports = router;
