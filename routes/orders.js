// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { verifyTokenUser } = require("../middlewares/Vcode");
const { postOrder, getOrdersByUserId } = require("../controllers/orderController");

// Create a new order (admin or user who owns the order)
router.post("/create", verifyTokenUser, postOrder);

// Fetch all orders for the authenticated user
router.get("/getOrder/:userId", verifyTokenUser, getOrdersByUserId);

module.exports = router;
