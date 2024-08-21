const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    ingredients:[
        {
            type: String,
            required: true
        }
    ],
    method:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    categories:[
        {
            type: Schema.Types.ObjectId,
            ref: 'categories'
        }
    ],
    creationDate:{
        type: Date,
        default: Date.now()
    },
    image:{
        type: Schema.Types.ObjectId,
        ref: 'images'
    }
})

module.exports = mongoose.model('posts', Post)