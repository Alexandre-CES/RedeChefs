/*
    *crud's index page

    TODO: I want to give certain people the power to create other admins
*/

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../../models/moderation/Admin')
require('../../../models/post/Category')
const Admin = mongoose.model('admins')

router.get('/', async (req,res)=>{

    const userId = req.user._id
    const adminUser = await Admin.findOne({user:userId})

    //check if user has permission
    let isOwner = false
    if(adminUser.type == 'owner'){
        isOwner = true
    }

    res.render('admin/crud/index', {isOwner:isOwner})
  
})

module.exports = router