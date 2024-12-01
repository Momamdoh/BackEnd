const express = require("express");
const router = express.Router();
const {verifyTokenAdmin} = require("../middlewares/Vcode");
const { getAllBooks , getBooksById , postBook, EditBookDetails, DeleteBookDetails, getBooksByCategory} = require("../controllers/bookController");



router.get("/getall", getAllBooks);
router.get("/catogory/:catogory", getBooksByCategory); // For getting books by category
router.get("/:id",getBooksById);
router.post("/postbook", verifyTokenAdmin, postBook );
router.put("/:id", verifyTokenAdmin, EditBookDetails);
router.delete("/:id", verifyTokenAdmin, DeleteBookDetails);
module.exports = router;
