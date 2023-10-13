const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userName = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.query.review
  if(!books[isbn]){
      res.send("It does not any book with that isbn")
  }

  books[isbn].reviews[userName] = review
  res.send("Review added succesfully")


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const userName = req.session.authorization.username
  const isbn = req.params.isbn
  if(!books[isbn]){
    res.send("It does not any book with that isbn")
  }

  if(books[isbn].reviews[userName]){
      delete books[isbn].reviews[userName]
      res.send("Review deleted succesfully")
  } else {
      res.send("You do not have any review on this book")
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
