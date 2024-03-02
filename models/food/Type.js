const mongoose = require('mongoose')
const Schema = mongoose.Schema

//meat, vegetable, fruit
const Type = new Schema({
    type:{
        type: String,
        require: true
    },
    category:[{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }]
})

module.exports('types', Type)