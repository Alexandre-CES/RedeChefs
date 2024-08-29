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
    await Admin.findOne({user:userId}).then((admin)=>{

        //check if user has permission
        let isOwner = false
        if(admin.type == 'owner'){
            isOwner = true
        }

        res.render('admin/crud/index', {isOwner:isOwner})
        
    }).catch((err)=>{
        req.flash('error_msg',err)
        res.redirect('/admin')
    })
})

module.exports = router