const express = require('express')
const router = express.Router()

// Importing sub-routes
const createRoute = require('./create')
const reportRoute = require('./reports')
const indexRoute = require('./index')

// Using sub-routes
router.use('/create', createRoute)
router.use('/reports', reportRoute)
router.use('/', indexRoute)

module.exports = router
