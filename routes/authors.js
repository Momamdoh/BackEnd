const express = require("express");
const router = express.Router();
const {verifyTokenAdmin} = require("../middlewares/Vcode");
const { getallAuthors, getAuthorById, createauthor, editAuthor, deleteAuthor } = require("../controllers/AuthorController");


router.get("/getall", getallAuthors);
router.get("/:id", getAuthorById);
router.post("/signup", verifyTokenAdmin, createauthor);
router.put("/:id", verifyTokenAdmin, editAuthor);
router.delete("/:id", verifyTokenAdmin, deleteAuthor);

module.exports = router;
