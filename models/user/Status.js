const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Status = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    verified:{
        type: Boolean,
        default: false
    },
    admin:{
        type: Boolean,
        default: false
    },
    warningCount:{
        type: Number,
        default: 0
    },
    warnings: [{
        date:{
            type: Date,
            default: Date.now()
        },
        reason:{
            type: String,
            required: true
        }
    }],
    banned:{
        type: Boolean,
        default: false
    },
    bannedUntil:{
        type: Date,
        default: null,
        required: false
    }
})

module.exports = mongoose.model('status', Status)