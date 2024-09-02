/*
    *crud's index page
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
        let canModifyAdmin = false
        if(admin.type == 'owner' || admin.type == 'admin'){
            canModifyAdmin = true
        }

        res.render('admin/crud/index', {canModifyAdmin:canModifyAdmin})
        
    }).catch((err)=>{
        req.flash('error_msg',err)
        res.redirect('/admin')
    })
})

module.exports = router