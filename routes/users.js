const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require("passport");


//Bring in user model
let User = require('../models/user');

//Register form

router.get('/register', function(req, res){
    res.render('register');
})

//Register process
router.post('/register', function(req, res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    var ref = req.body.ref;

    var canRegister = -1;

    //TODO: Express validator check
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    console.log("Errors: " + JSON.stringify(errors));
    if(errors)
    {
        res.render('register', {
            errors:errors
        })
    }
    else
    {        
        let newUser = new User({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            ref: ref
        })        

        //Check if username/email is already taken
        User.find({$or:[{username : req.params.username}, {email : req.params.email}]}, function(err, resp){
            if(err){
                canRegister = 0;
            }
            else{
                if(resp.length == 0){
                    req.flash('danger', 'Username/email exist already, please pick a different one');
                    res.render('register');
                }
                else{
                    if(ref == undefined){
                        ref = "none";
                    }
        
                    bcrypt.genSalt(10, function(err, salt){
                        bcrypt.hash(newUser.password, salt, function(err, hash){
                            if(err)
                            {
                                console.log(err);
                            }
                            newUser.password = hash;
                            newUser.save(function(err){
                                if(err)
                                {
                                    console.log(err);
                                    return;
                                }
                                else
                                {
                                    req.flash('success', 'Successfully register');
                                    res.redirect('/users/login');
                                }
                            })
                        });
        
                    })
                }
            }
        });
    }
});

//Login form
router.get('/login', function(req, res){
    res.render('login');
})

//Login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Logout process
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged out successfully');
    res.redirect('/users/login');
})

module.exports = router;