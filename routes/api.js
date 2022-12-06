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
const Book = mongoose.model("Book", bookSchema);
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
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
      if(req.body.title) {
        let newBook = new Book({ title: req.body.title });
        newBook.save((err) => {
          if(err) console.log("Save error: ", err);
          res.json({ _id: newBook._id, title: newBook.title });
        });
      }
      else {
        res.send("missing required field title");
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err,res) => {
        if(err){ 
          return console.log("somthing went wrong when deleting")
        }
        res.send("complete delete successful");
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
