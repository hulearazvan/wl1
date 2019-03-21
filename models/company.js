const mongoose = require('mongoose');

let companySchema = mongoose.Schema({
    DENUMIRE:{
        type: String,
        required: false,
    },
    CUI:{
        type: String,
        required: false,
    },
}, {collection: 'cusediu_1'});

let Company = module.exports = mongoose.model('Company', companySchema);