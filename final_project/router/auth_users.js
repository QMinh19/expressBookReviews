const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = "your_jwt_secret";
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const token = req.header("Authorization");
if (!token) {
  return res.status(401).json({ message: "Unauthorized" });
}

try {
  const decoded = jwt.verify(token, 'secretKey'); // Validate token using secret key
  req.username = decoded.username; // Attach username to request object for easy access
  next();
} catch (error) {
  return res.status(401).json({ message: "Unauthorized" });
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists in the 'users' array and the password matches
  const user = users.find(u => u.username === username);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // If credentials are valid, create a JWT token
  const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' }); // 'secretKey' should be stored securely in production

  // Respond with the JWT token
  return res.status(200).json({ message: "Login successful for 1h", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;  // Extract ISBN from route params
  const review = req.query.review; // Get review from query params
  const username = req.username;  // Get the logged-in user's username

  // Validate that a review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this ISBN
  if (book.reviews[username]) {
    // Modify existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  }

  // Add new review for the user
  book.reviews[username] = review;
  return res.status(201).json({ message: "Review added successfully" });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.header("Authorization").replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        const username = decoded.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user has a review for this ISBN
        if (!books[isbn].reviews[username]) {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }

        // Delete the review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
