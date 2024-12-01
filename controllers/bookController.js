
const asyncHandler = require("express-async-handler");
const { validateinputbook , validateupdatebook , Book} = require("../models/Book");


/**
 * @disc Get books by category
 * @route /books/category/:category
 * @method GET
 * @access public
 *
 */
const getBooksByCategory = asyncHandler(async (req, res) => {
  console.log("Request Params:", req.params); // Log request parameters

  const validCategories = ["art", "history", "crime"];
  const catogory = req.params.catogory ? req.params.catogory.toLowerCase() : null; // Safe access

  // Check if the provided category is valid
  if (!validCategories.includes(catogory)) {
    return res.status(400).json({ message: "Invalid category. Allowed categories are: art, history, crime." });
  }

  // Fetch books using the field name 'catogory'
  const books = await Book.find({ catogory: catogory }).populate("author", ["firstname"]);

  if (books.length > 0) {
    res.status(200).json(books);
  } else {
    res.status(404).json({ message: "No books found for this category" });
  }
});


/**
 * @disc Get all
 * @route
 * @method Get
 * @access public
 *
 */

const getAllBooks = asyncHandler(
    async (req, res) => {
      //comparison query operators
      //$eq = equalto
      //$ne = not equal
      //$lt = less than
      //$lte = less than equal
      //$in: [ 10 ,9]
      //$nin = []
    const books = await Book.find().populate("author" , ["firstname"]); //remove ["firstname"]
    res.status(200).json(books);
  });

  /**
 * @disc Get by id
 * @route
 * @method Get
 * @access public
 *
 */

  const getBooksById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  });

  /**
 * @disc create new
 * @route
 * @method POST
 * @access private only admin
 *
 */

  const postBook =  asyncHandler( async (req, res) => {
    const { error } = validateinputbook(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const book = new Book({
      title: req.body.title,
      catogory: req.body.category,
      author: req.body.author,
      descripe: req.body.author,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result); 
  });

  /**
 * @disc
 * @route
 * @method PUT
 * @access private only admin
 *
 */

  const EditBookDetails = asyncHandler(async (req, res) => {
    const { error } = validateupdatebook(req.body);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const book = await Book.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        author: req.body.author,
        catogory: req.body.category,
        descripe: req.body.descripe,
        price: req.body.price,
        cover: req.body.cover
      }
    }, { new: true });
  
    if (book) {
      res.status(200).json({ message: "book has been updated", book });
    } else {
      res.status(404).json({ message: "book not found" });
    }
  });

  /**
 * @disc
 * @route
 * @method DELETE
 * @access private only admin
 *
 */

  const DeleteBookDetails = asyncHandler( async(req, res) => {
 
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json({ message: "book has been Deleted" });
    } else {
      res.status(404).json({ message: "book not found" });
    }
  
  });


  module.exports = {
    getAllBooks,
    getBooksById,
    postBook,
    EditBookDetails,
    DeleteBookDetails,
    getBooksByCategory
  }