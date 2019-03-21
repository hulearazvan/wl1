const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require("./config/database");
const passport = require("passport");

mongoose.connect(config.database, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', function(err){
    console.log("Connected!");
})

db.on('error', function(err){
    console.log(err);
})

//Init
const app = express();

let Article = require('./models/article');
let Company = require('./models/company');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Body parser stuff
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
    secret: "supremul consiliu",
    resave: true,
    saveUninitialized: true,
    //cookie: {secure: true}
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express middleware validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}))

//Passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Home route
app.get('/', function(req, res){
    Company.find({}, function(err, companies){    
        if(err){
            console.log(err);
        }
        else{
            res.render('index', {
                title:"Dashboard home",
                companies: companies
            })
        }
    }).limit(50);
})

//Route files
let companies = require('./routes/companies');
app.use('/companies', companies);
let users = require('./routes/users');
app.use('/users', users);

//Add article
app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title:"Add new article"
    })
})

//Add submit post route
app.post('/articles/add', function(req, res){
    let article = new Article();
    article.Title = req.body.title;
    article.Author = req.body.author;
    article.Body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else{
            res.redirect('/');
        }
    })
});

//Start server
app.listen(3000, function()
{
    console.log("Server started on port 3000");
})