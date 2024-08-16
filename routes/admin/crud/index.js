/*
    *crud's index page

    TODO: I want to give certain people the power to create other admins, but i'm still thinking in a good way to do this without letting anyone in this page or in database do it. I started it by creating a model just for Admins, just need to remove parts checking if user is admin and put a "check if actually have a admin with this id" at place....in progress
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