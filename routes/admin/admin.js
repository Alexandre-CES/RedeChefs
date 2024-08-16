/*
    *admin's module
*/
const express = require('express')
const router = express.Router()

const isAdmin = require('./middlewares/isAdmin')

router.use(isAdmin)

// Importing sub-routes
const crudRoute = require('./crud/crud')
const reportRoute = require('./reports')
const indexRoute = require('./index')

// Using sub-routes
router.use('/crud', crudRoute)
router.use('/reports', reportRoute)
router.use('/', indexRoute)

module.exports = router
