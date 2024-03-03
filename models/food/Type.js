const mongoose = require('mongoose')
const Schema = mongoose.Schema

//meat, vegetable, fruit
const Type = new Schema({
    type:{
        type: String,
        required: true
    },
    category:[{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }]
})

module.exports = mongoose.model('types', Type)