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

    /*
    *The database doesn't store images.
    The images are stored in the uploads's folder when you upload them, then their path is stored at database for later use.
    It's working, and i'm not planning store the actual images in db for now.
    */
    imagePath:{
        type:String
    }
})

module.exports = mongoose.model('posts', Post)