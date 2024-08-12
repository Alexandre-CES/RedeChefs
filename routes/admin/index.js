const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../models/user/Status')
const Status = mongoose.model('status')

router.get('/', async (req,res)=>{
    if(req.isAuthenticated()){

        userId = req.user._id

        const userStatus = await Status.findOne({user:userId})

        if(userStatus.admin == true){
            res.render('admin/index')
        }else{
            res.redirect('/')
        }
        
    }else{
        res.redirect('/')
    }
})

module.exports = router