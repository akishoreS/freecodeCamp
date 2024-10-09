const express = require('express');
const { signup, signin, googleAuth, googleCallback,sendOtp,verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
module.exports = router;
