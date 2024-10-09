const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign up
exports.signup = async (req, res) => {
  const { name, email, password ,mobileNumber} = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email id already exists' });

    // Create new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      mobileNumber
    });

    // Save user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response along with success message
    res.status(201).json({ msg: 'User registered successfully', token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Sign in
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response along with success message
    res.json({ msg: 'Logged in successfully', token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Google Sign-in
const passport = require('passport');
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/signin' }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ msg: 'Internal server error', error: err });
    }
    if (!user) {
      return res.status(401).json({ msg: 'Authentication failed' });
    }

    // Create a JWT token using the user ID from req.user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and a success message in the response
    return res.status(200).json({ 
      msg: 'Signed in successfully!', 
      token 
    });
  })(req, res, next);
};

