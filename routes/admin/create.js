/*
    Made to create new stuff without needing to directly inserting into database

    TODO: I want to give certain people the power to create other admins, but i'm still thinking in a good way to do this without letting anyone in this page or in database do it. I started it by creating a model just for Admins, just need to remove parts checking if user is admin and put a "check if actually have a admin with this id" at place 

*/

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../models/user/Status')
require('../../models/post/Category')
const Status = mongoose.model('status')
const Category = mongoose.model('categories')

router.get('/', async (req,res)=>{
    if(req.isAuthenticated()){

        userId = req.user._id

        //checks if user is admin
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

//*Creates a new category
router.post('/category', async (req,res)=>{

    const inputCategory = req.body.inputCategory

    //check if field is not blank
    if(!inputCategory){
        req.flash('error_msg', 'Please, fill the blank fields')
        res.redirect('/admin/create')
    }else{
        //check if category already exist
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