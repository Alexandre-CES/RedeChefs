/*
    *account's module
*/
const express = require('express')
const router = express.Router()

// Importing sub-routes
const authRoute = require('./auth')
const indexRoute = require('./index')

// Using sub-routes
router.use('/auth', authRoute)
router.use('/', indexRoute)

module.exports = router
