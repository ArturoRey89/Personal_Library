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
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Books.find({}, (err, books) => {
        if (err || !books) {
          res.status(500);
          res.send("error on find: ", err);
        } 
        else {
          res.json(books);
        }
      });
    })

    .post(function (req, res) {
      //response will contain new book object including atleast _id and title
      let newTitle = req.body.title;
      if (!newTitle) {
        res.send("missing required field title");
      } else {
        let newBook = new Books({ title: newTitle });
        newBook.save((err) => {
          if (err || !newTitle) {
            res.status(500);
            res.send("Save error: ", err);
            return;
          }
          res.json({ _id: newBook._id, title: newBook.title });
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Books.deleteMany(({}), (err, deleteInfo) => {
        if (err || !deleteInfo.acknowledged) {
          res.send("somthing went wrong when deleting");
          return;
        }
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookId = req.params.id;
      if (!bookId) {
        res.send("missing required field comment");
        return;
      }
      try {
        let bookIdObject = ObjectId(bookId);
        findOneBookById(
          { _id: bookIdObject },
          { __v: 0, commentcount: 0 },
          (err, book) => {
            if (err) {
              res.send("no book exists");
              return;
            }
            res.send(book);
          }
        );
      } 
      catch (e) {
        console.log(`error: ${e}`);
        res.send("no book exists");
      }
    })

    .post(function (req, res) {
      //json res format same as .get
      let bookId = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      try {
        let bookIdObject = ObjectId(bookId);
        findOneBookById({ _id: bookIdObject }, { __v: 0 }, (err, book) => {
          if (err) {
            console.log(err);
            res.send("no book exists");
            return;
          }
          book.commentcount++;
          book.comments.push(comment);
          book.save();
          res.send(book);
        });
      } 
      catch (e) {
        console.log(`catch error: ${e}`);
        res.send("no book exists");
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'delete successful'
      let bookId = req.params.id;
      try {
        let bookIdObject = ObjectId(bookId);
        Books.deleteOne({_id: bookIdObject}, (error,deleteInfo) => {
          if (error || !deleteInfo.deletedCount) {
            res.send("no book exists");
          } else {
            res.send("delete successful");
          }
        });
      } 
      catch (e) {
        console.log(`catch error: ${e}`);
        res.send("no book exists");
      }

    });
};

const findOneBookById = (bookIdObject, filter, done) => {
  Books.findOne({ _id: bookIdObject }, filter, (error, book) => {
    if (error) {
      done(error, null);
    } else if (!book) {
      done({ error: "no book found" }, null);
    } else {
      done(null, book);
    }
  });
};