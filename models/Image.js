/*
    *Model for images
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Image = new Schema({
    data: Buffer,
    contentType: String,
    uploadDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('images', Image)