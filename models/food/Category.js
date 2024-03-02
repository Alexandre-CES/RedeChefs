const mongoose = require('mongoose')
const Schema = mongoose.Schema

//breakfast, drinks, vegetarian
const Category = new Schema({
    category:{
        type: String,
        require:true
    },

})

module.exports('categories', Category)