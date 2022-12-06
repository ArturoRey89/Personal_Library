/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  let id;
  let wrongId = "something";
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({title: "New Book"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.hasAnyKeys(
              res.body[0], 
              ["commentcount","title", "_id"],
              "Books in array should contain all key attr."
            );
            assert.strictEqual(res.body.title, "New Book")
            assert.strictEqual(res.body.commentcount, 0);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required field title");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array of books");
            assert.hasAllKeys(
              res.body[0],
              ["commentcount", "title", "_id", "comments", "__v"],
              "Books in array should contain all key attr."
            );
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/" + wrongId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.hasAllKeys(res.body, "no book exists");
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, ["_id", "title", "comments"]);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post("/api/books/" + id)
          .send({comment: "new comment"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post("/api/books/" + id) 
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post("/api/books/" + wrongId)
          .send({ comment: "no id comment" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .del("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .del("/api/books/" + wrongId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });

    });

  });

});
