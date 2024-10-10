/* 
    *Model for categories
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//breakfast, drinks, vegetarian
const Category = new Schema({
    category:{
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('categories', Category)