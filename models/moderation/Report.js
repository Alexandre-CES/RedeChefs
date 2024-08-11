const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Report = new Schema({
    reporter:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    targetType: {
        type: String,
        enum: ['post', 'account'], 
        required: true
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    reason:{
        type:String,
        enum:[
            'harassment',
            'violence',
            'inappropriate content',
            'bullying'
        ],
        required: true
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'], 
        default: 'pending'
    }
})

module.exports = mongoose.model('reports', Report)