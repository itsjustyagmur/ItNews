var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var apps = require("./public/javascript/app")

var axios = require("axios");
var cheerio = require("cheerio");



var PORT = 3003;


var app = express();


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/newsDb", { useNewUrlParser: true });


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    });
    



    //routes//

    app.get("/scrape", function(req, res) {
    res.render("home");
        axios.get("https://www.cosmopolitan.com/politics").then(function(response) {
           
            var $ = cheerio.load(response.data);
        
          
            $("article h2").each(function(i, element) {
           
            var result = {};
    
           
            db.Article.create(result)
                .then(function(dbArticle) {
              
                console.log(dbArticle);
                })
                .catch(function(err) {
               
                console.log(err);
                });
            });
        
            res.send("Scrape Complete");
        });
        });
    
    app.get("/articles", function(req, res) {
    
        db.Article.find({})
        .then(function(dbArticle) {
      
        res.json(dbArticle);
        })
        .catch(function(err) {
    
        res.json(err);
        });
    });
    app.get("/articles/:id", function(req, res) {
      
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function(dbArticle) {
            res.json(dbArticle);
            })
            .catch(function(err) {
            res.json(err);
            });
        });
        app.post("/articles/:id", function(req, res) {
           
            var newNote = new Note(req.body);
        
          
            newNote.save(function(error, doc) {
               
                if (error) {
                    console.log(error);
                }
                else {
                   
                    Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                    
                    .exec(function(err, doc) {
                        
                        if (err) {
                            console.log(err);
                        }
                        else {
                           
                            res.send(doc);
                        }
                    });
                }
            });
        });
        