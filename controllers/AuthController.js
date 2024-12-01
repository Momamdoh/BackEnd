const asyncHandler = require("express-async-handler");
const { User, ValidateUserLogin, ValidateUserRegister} = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};


/**
 * @desc Signup with Verification Code
 * @route /api/auth/signup
 * @method POST
 * @access public
 */
const Signup = asyncHandler(async (req, res) => {
  const { error } = ValidateUserRegister(req.body);
  const message = {};

  // Destructure the body for easier validation
  const { fname, lname, phone, password, email } = req.body;

  // Basic field validation
  if (!fname || !lname || !phone || !password || !email) {
    return res.status(200).json({ status: 'fail', message: 'All fields are required' });
  }

  // Validate individual fields
  if (fname.length < 3) message.fname = "First name must be at least 3 characters long";
  if (lname.length < 3) message.lname = "Last name must be at least 3 characters long";
  if (phone.length !== 11) message.phone = "Phone number must be exactly 11 characters long";
  if (password.length < 6) message.password = "Password must be at least 6 characters long";

  // Check if email or phone already exists
  if (await User.findOne({ email })) message.email = "Email already in use";
  if (await User.findOne({ phone })) message.phone = "Phone number already in use";

  if (Object.keys(message).length > 0) {
    return res.status(200).json({ status: 'fail', message });
  }

  // Hash password and create user
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password, salt);
  const verificationCode = generateVerificationCode();

  const user = new User({
    email,
    phone,
    password: req.body.password,
    fname,
    lname,
    verificationCode,
  });

  const result = await user.save();
  const token = user.generateToken();

  // Send verification code via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is ${verificationCode}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(200).json({ status: 'fail', message: { email: "Failed to send verification email" } });
    } else {
      console.log('Verification email sent: ' + info.response);
      const { password, ...userData } = result._doc;
      res.status(200).json({ status: 'success', data: { ...userData, token } });
    }
  });
});

/**
 * @desc Verify Email
 * @route /api/auth/verify-email
 * @method POST
 * @access public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  console.log('Request Body:', req.body); // Debug line

  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ status: 'fail', message: "Email and verification code are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: 'fail', message: "User not found" });
  }

  console.log('User Verification Code:', user.verificationCode); // Debug line
  if (user.verificationCode !== Number(verificationCode)) {
    return res.status(200).json({ status: 'fail', message: "Invalid verification code" });
  }

  user.isVerified = true;
  user.verificationCode = null;

  await user.save();
  res.status(200).json({ status: 'success', message: "Email successfully verified" });
});


/**
 * @desc Login
 * @route /api/auth/login
 * @method POST
 * @access public
 */
const login = asyncHandler(async (req, res) => {
  // Validate user login data
  const { error } = ValidateUserLogin(req.body);
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.details[0].message });
  }

  const message = {};
  const { email, password } = req.body;
  
  // Initialize foundUser outside try block
  let foundUser = null;

  if (!email) message.email = 'Email is required';
  if (!password) message.password = 'Password is required';
  else if (password.length < 6) message.password = 'Password must be at least 6 characters long';

  if (email && password) {
    try {
      foundUser = await User.findOne({ email });
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ status: 'fail', message: 'Error querying user' });
    }

    if (!foundUser) {
      message.email = "Invalid email";
    } else {
      if (!foundUser.isVerified) message.email = "Email not verified";

      if (!message.password) {
        const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordMatch) message.password = "Invalid password";
      }
    }
  }

  if (Object.keys(message).length > 0) {
    return res.status(200).json({ status: 'fail', message });
  }

  if (!foundUser) {
    return res.status(500).json({ status: 'fail', message: 'User not found after validation' });
  }

  const token = foundUser.generateToken();
  const { password: userPassword, ...data } = foundUser._doc;

  res.status(200).json({ status: 'success', data, token });
});

module.exports = {
  Signup,
  verifyEmail,
  login,
};
