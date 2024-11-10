const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body; // Destructure username and password from request body
  
  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // If validation passes, push the new user to the users array
  users.push({ username, password });

  // Respond with a success message
  return res.status(201).json({ message: "User registered successfully" });
});
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; 
  const booksByAuthor = [];

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor); 
  } else {
    res.status(404).json({ message: "No books found for this author" }); // If no books found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; 
  const booksByTitle = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    res.json(booksByTitle); 
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" }); // Book not found by ISBN
  }
});
// Endpoint to get the list of books
public_users.get('/', async function (req, res) {
    try {
        // Using async/await with Axios to fetch the list of books from the server
        const response = await axios.get('https://minhdqse1843-5001.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');  // Replace with actual API endpoint if different
        const booksList = response.data;

        // Send the list of books as the response
        res.status(200).json({ books: booksList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch books." });
    }
});
// Endpoint to get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params; // Get ISBN from the request parameters

    try {
        // Using async/await with Axios to fetch book details from the server by ISBN
        const response = await axios.get(`https://minhdqse1843-5001.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);  // Replace with the correct API endpoint
        const bookDetails = response.data;

        if (bookDetails) {
            // Send the book details as the response
            res.status(200).json({ book: bookDetails });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch book details" });
    }
});
// Endpoint to get book details based on Author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params; // Get the author from the request parameters

    try {
        // Using async/await with Axios to fetch book details based on author
        const response = await axios.get(`https://minhdqse1843-5001.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);  // Replace with the correct API endpoint
        const booksByAuthor = response.data;

        if (booksByAuthor.length > 0) {
            // Send the book details as the response
            res.status(200).json({ books: booksByAuthor });
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch book details by author" });
    }
});
// Endpoint to get book details based on Title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params; // Get the title from the request parameters

    try {
        // Using async/await with Axios to fetch book details based on title
        const response = await axios.get(`https://minhdqse1843-5001.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);  // Replace with the correct API endpoint
        const bookDetails = response.data;

        if (bookDetails) {
            // Send the book details as the response
            res.status(200).json({ book: bookDetails });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch book details" });
    }
});

module.exports.general = public_users;
