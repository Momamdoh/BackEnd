const asyncHandler = require('express-async-handler');
const { Order, validateOrder } = require('../models/order');

/**
 * @desc Create a new order
 * @route POST /api/orders/create
 * @access Private (only Admin and User)
 */
const postOrder = asyncHandler(async (req, res) => {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { books, status } = req.body;

    try {
        const userId = req.user.id; // Get userId from the token payload

        // Create the order
        const order = new Order({
            user: userId,
            books: books,
            status: status || 'pending',
        });

        await order.save(); // Save the order to the database
        res.status(201).json(order); // Respond with the created order
    } catch (err) {
        console.error("Error creating the order:", err);
        res.status(500).json({ message: "Error creating the order." });
    }
});


/**
 * @desc Fetch all orders for a specific user
 * @route GET /api/orders/:userId/getOrder
 * @access Private (only Admin and User)
 */
const getOrdersByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    try {
        // Check if the authenticated user is either the owner or an admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to access these orders." });
        }

        // Fetch orders for the specific user
        const orders = await Order.find({ user: userId }).populate("books");
        
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json(orders); // Respond with the user's orders
    } catch (err) {
        console.error("Error fetching orders for user:", err);
        res.status(500).json({ message: "Error fetching orders for user." });
    }
});

/**
 * @desc Update an existing order
 * @route PUT /api/orders/:orderId
 * @access Private (only Admin and User)
 */
const updateOrder = asyncHandler(async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found." });

        if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this order." });
        }

        // Update the order status if provided
        order.status = status || order.status;
        await order.save();

        res.status(200).json(order); // Respond with the updated order
    } catch (err) {
        console.error("Error updating the order:", err);
        res.status(500).json({ message: "Error updating the order." });
    }
});

/**
 * @desc Delete an existing order
 * @route DELETE /api/orders/:orderId
 * @access Private (only Admin and User)
 */
const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found." });

        if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to delete this order." });
        }

        await Order.findByIdAndDelete(req.params.orderId); // Delete the order
        res.status(200).json({ message: "Order has been deleted." });
    } catch (err) {
        console.error("Error deleting the order:", err);
        res.status(500).json({ message: "Error deleting the order." });
    }
});

module.exports = {
    postOrder,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
};
