const asyncHandler = require("express-async-handler");
const { Author , validateinputauthor , validateupdateauthor } = require("../models/Author");



/**
 * @disc Get all autjors
 * @route
 * @method Get
 * @access public
 *
 */

const getallAuthors = asyncHandler( 
    async (req, res) => {
    const { pageNumber} = req.query; //pageNumber parameters in thunder client
    const authorpage = 2;
    const authorlist = await Author.find().skip((pageNumber - 1) * authorpage).limit(authorpage); //  const authorlist = await Author.find().sort({firstname});
    res.status(200).json(authorlist); //replace with array authors
  
});

/**
 * @disc Get by id
 * @route
 * @method Get
 * @access public
 *
 */

const getAuthorById = asyncHandler(async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: "Author not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
  });


  /**
 * @disc create new
 * @route
 * @method POST
 * @access private by admin only
 *
 */

  const createauthor = asyncHandler(async (req, res) => {
    const { error } = validateinputauthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const author = new Author({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      image: req.body.image, // optional, will default to "d.png" if not provided
    });
  
    const result = await author.save();
    res.status(201).json(result); // 201 created ok
  });

  /**
 * @disc
 * @route
 * @method PUT
 * @access public
 *
 */

  const editAuthor = asyncHandler( async (req, res) => {
    const { error } = validateupdateauthor(req.body);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    //   const author = authors.find((b) => b.id === parseInt(req.params.id));
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            image: req.body.image, // optional, will default to "d.png" if not provided
          },
        },
        { new: true }
      );
      if (author) {
        res.status(200).json({ message: "author has been updated" });
      } else {
        res.status(404).json({ message: "author not found" });
      }
  });

  /**
 * @disc
 * @route
 * @method DELETE
 * @access public
 *
 */

  const deleteAuthor = asyncHandler(
    async (req, res) => {
      //   const author = authors.find((b) => b.id === parseInt(req.params.id));
      const author = await Author.findById(req.params.id);
      if (author) {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "author has been Deleted" });
      } else {
        res.status(404).json({ message: "author not found" });
      }
  })




module.exports = {

    getallAuthors,
    getAuthorById,
    createauthor,
    editAuthor,
    deleteAuthor


}