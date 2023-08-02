const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let filterUsers = users.filter(user => user.username === username)
  if(filterUsers.length > 0){
    return true
  }
  return false
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.session.authorization['username']
  books[req.params.isbn].reviews.user = req.query.review
  return res.status(200).json(`The review for the book with ISBN ${req.params.isbn} has been Added/Modify `);
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.session.authorization['username']
  if(isValid(user)){
    delete books[req.params.isbn].reviews.user
    return res.status(200).json(`The review for the book with ISBN ${req.params.isbn} posted by user ${user} has been deleted`);
  }
  return res.status(400).json(`unable to delete review`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
