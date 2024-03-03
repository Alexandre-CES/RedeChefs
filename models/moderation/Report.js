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
    reason: {
        type: String,
        required: true
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