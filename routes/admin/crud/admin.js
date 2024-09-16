const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../../models/moderation/Admin')
require('../../../models/user/User')
const Admin = mongoose.model('admins')
const User = mongoose.model('users')

const { validate } = require('../../../helpers/validateReqBody')

router.get('/', async (req,res)=>{

    const userId = req.user._id
    await Admin.findOne({user:userId}).then((admin)=>{

        let isOwner = false
        if(admin.type == 'owner'){
            isOwner = true
        }

        res.render('admin/crud/admin',{isOwner:isOwner})
    
    }).catch((err)=>{
        req.flash('error_msg',err)
        res.redirect('/admin/crud/')
    })

      
})

router.post('/create', async (req,res)=>{
    
    const rules = {
        userId:{required:true, minLength:1}
    }

    const errors = validate(req.body, rules)

    if(errors.length > 0){
        req.flash('error_msg',errors)
        res.redirect('/admin/crud/admin/')
    }else{

        const user = User.findOne({_id:req.body.userId}).lean()

        if(!user){
            req.flash('error_msg','User does not exist')
            res.redirect('/admin/crud/admin/')
        }else{

            const isAdmin = await Admin.findOne({user:req.body.userId}).lean()

            if(isAdmin){
                req.flash('error_msg','User is already an admin')
                res.redirect('/admin/crud/admin/')
            }else{

                console.log(req.body.type)

                const adminData = {
                    user:req.body.userId,
                    type:req.body.role
                }

                await new Admin(adminData).save().then(()=>{
                    req.flash('success_msg','Admin added successfully')
                    res.redirect('/admin/crud/admin')
                })
            }
        }
    }
})

router.post('/delete', async (req,res)=>{
    const rules = {
        userId:{required:true, minLength:1}
    }

    const errors = validate(req.body, rules)

    if(errors.length > 0){
        req.flash('error_msg',errors)
        res.redirect('/admin/crud/admin/')
    }else{
        await Admin.findOneAndDelete({user:req.body.userId}).then((user)=>{
            req.flash('success_msg',`User ${user.user} deleted successfully`)
            res.redirect('/admin/crud/admin/')
        }).catch((err)=>{
            req.flash('error_msg',err)
            res.redirect('/admin/crud/admin/')
        })

    }
})

module.exports = router