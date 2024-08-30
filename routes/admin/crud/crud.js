/*
    *crud's module
*/
const express = require('express')
const router = express.Router()

// Importing sub-routes
const adminRoute = require('./admin')
const categoryRoute = require('./category')
const indexRoute = require('./index')

// Using sub-routes
router.use('/admin', adminRoute)
router.use('/category', categoryRoute)
router.use('/', indexRoute)

module.exports = router
