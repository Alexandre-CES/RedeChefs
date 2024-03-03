const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Following = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    following:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

module.exports = mongoose.model('following', Following)