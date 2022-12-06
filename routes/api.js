/*
*
*
*       Complete the API routing below
*       
*       
*/
'use strict';
require("dotenv").config();
const mongoose = require("mongoose");

//connect to database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true,});

const db = mongoose.connection;
db.on("error", (error) => console.log("Database connection error: ", error));
db.on("connected", () => console.log("Connected to database"));
//database structure
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
  comments: [String]
});
const Books = mongoose.model("Book", bookSchema);
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Books.find({}, (err, books) => {
        if(err){
          res.status(500)
          console.log("error on find: ", err)
        }
        else{
          res.json(books);
        }
      })
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let newTitle = req.body.title;
      if (newTitle) {
        let newBook = new Books({ title: newTitle });
        newBook.save((err) => {
          if (err){ 
            res.status(500)
            return console.log("Save error: ", err)
          };
          res.json({ _id: newBook._id, title: newBook.title });
        });
      } else {
        res.send("missing required field title");
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, res) => {
        if (err) {
          res.status(500)
          return console.log("somthing went wrong when deleting");
        }
        res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookId = req.params.id;
      if (bookId) {
        Books.findOne(
        { _id: ObjectId (bookId)}, 
        {__v:0, commentcount: 0},
        (err, book) => {
          if (err) {
            res.status(500)
            return console.log("findOne bookId error: ", err)
          }
          if(book) {
            res.send(book)
          } else {
            res.send("no book exists");
          }

        });
      } else {
        res.send("missing required field comment");
      }
    })
    
    .post(function(req, res){
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;
    })
    
    .delete(function(req, res){
      //if successful response will be 'delete successful'
      let bookid = req.params.id;
    });
  
};
