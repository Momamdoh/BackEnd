const express = require("express");
const router = express.Router();
const { login, Signup , verifyEmail} = require("../controllers/AuthController");

router.post("/signup", Signup);
router.post("/login", login);
router.post('/verify-email', verifyEmail);




module.exports = router;
