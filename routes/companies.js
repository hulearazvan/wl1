const express = require('express');
const router = express.Router();

//Bring in company model
let Company = require('../models/company');
let User = require("../models/user");

//Get single company
router.get('/:id',ensureAuthenticated, function(req, res){
    Company.findById(req.params.id, function(err, company){
        if(err)
        {
            console.log(err);
            return;
        }
        else
        {
            res.render('company', {
                company:company
            })
        }
    });
});

//Load edit form
router.get('/edit_company/:id', function(req, res){
    Company.findById(req.params.id, function(err, company){
        res.render('edit_company', {
            title: "Edit company details",
            company:company
        })  
    });
})

//Edit/submit/update company details
router.post('/edit/:id', function(req, res){
    let company = {};
    company.DENUMIRE = req.body.DENUMIRE;

    let query = {_id:req.params.id}

    console.log("Company: " + company);
    Company.updateOne(query, company, function(err){
        if(err){
            console.log(err);
            return;
        } else{
            req.flash('success', 'Company details changed')
            res.redirect('/');
        }
    })
});

//Access control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;