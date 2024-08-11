const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/user/Status')
require('../models/post/Category')
require('../models/moderation/Report')
const Status = mongoose.model('status')
const Category = mongoose.model('categories')
const Report = moongose.model('reports')

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

router.get('/reports', async (req,res) =>{
    const reports = await  Report.find({status:'pending'}).lean()
    res.render('admin/reports/index', {reports:reports})
})

router.get('/create', async (req,res)=>{
    if(req.isAuthenticated()){

        userId = req.user._id

        const userStatus = await Status.findOne({user:userId})

        if(userStatus.admin == true){
            res.render('admin/create')
        }else{
            res.redirect('/')
        }
        
    }else{
        res.redirect('/')
    }
})

router.post('/create/category', async (req,res)=>{

    const inputCategory = req.body.inputCategory

    if(!inputCategory){
        req.flash('error_msg', 'Please, fill the blank fields')
        res.redirect('/admin/create')
    }else{
        const repeatedCategory = await Category.findOne({category:inputCategory})
        if (repeatedCategory){
            req.flash('error_msg', 'category already exist')
            res.redirect('/admin/create')
        }else{
            const categoryData ={
                category: inputCategory
            }

            await new Category(categoryData).save().then(()=>{
                req.flash('success_msg', 'Success creating category!')
                res.redirect('/admin/create')
            }).catch((err)=>{
                req.flash('error_msg', 'Error creating category: '+err)
                res.redirect('/admin/create')
            })
        }
    }

})

module.exports = router