const mongoose = require('mongoose')
const Schema = mongoose.Schema

//milk, apple, bread
const Ingredient = new Schema({
    Ingredient:{
        type: String,
        required:true
    },
    type:[
        {
            type: Schema.Types.ObjectId,
            ref: 'types',
            required: true
        }
    ],
    category:[
        {
            type: Schema.Types.ObjectId,
            ref: 'categories'
        }
    ]
})

module.exports = mongoose.model('ingredients', Ingredient)