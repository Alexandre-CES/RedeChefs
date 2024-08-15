const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../models/moderation/Admin')
const Admin = mongoose.model('admins')

router.get('/', async (req,res)=>{
    if(req.isAuthenticated()){

        userId = req.user._id

        //checks if user is admin
        const adminUser = await Admin.findOne({user:userId})
        if(adminUser){
            res.render('admin/index')
        }else{
            res.redirect('/')
        }
        
    }else{
        res.redirect('/')
    }
})

module.exports = router