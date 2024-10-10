/* 
    *Model for likes
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Like = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    likeDate:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('likes', Like)