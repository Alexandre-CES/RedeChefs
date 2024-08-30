const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { validate } = require('../../../helpers/validateReqBody')

router.get('/', async (req,res)=>{

    res.render('admin/crud/admin')  
})

module.exports = router