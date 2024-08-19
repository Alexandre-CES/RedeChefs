/*
    Made to create new stuff without needing to directly inserting into database
    TODO: admin validation
*/

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../../models/post/Category')
const Category = mongoose.model('categories')

const { validate } = require('../../../helpers/validateReqBody')

router.get('/', async (req,res)=>{

    //search all categories alphabetically
    const categories = await Category.find({}).sort({category:1}).lean()

    res.render('./admin/crud/category', {categories:categories})
})

//*Creates a new category
router.post('/create', async (req,res)=>{

    const inputCategory = req.body.inputCategory

    //check if field is not blank
    if(!inputCategory){
        req.flash('error_msg', 'Please, fill the blank fields')
        res.redirect('/admin/crud/category')
    }else{
        //check if category already exist
        const repeatedCategory = await Category.findOne({category:inputCategory})
        if (repeatedCategory){
            req.flash('error_msg', 'category already exist')
            res.redirect('/admin/crud/category')
        }else{
            const categoryData ={
                category: inputCategory
            }

            await new Category(categoryData).save().then(()=>{
                req.flash('success_msg', 'Success creating category!')
                res.redirect('/admin/crud/category')
            }).catch((err)=>{
                req.flash('error_msg', 'Error creating category: '+err)
                res.redirect('/admin/crud/category')
            })
        }
    }
})

//* Update category
router.get('/update/:categoryId', async(req,res)=>{

    const categoryId = req.params.categoryId
    const category = await Category.findOne({_id:categoryId}).lean()

    res.render('./admin/crud/editCategory', {category:category})
})

router.post('/update', async(req,res)=>{

    const rules = {
        categoryId:{required:true, minLength:1},
        newCategoryName:{required:true, minLength:1}
    }
    
    const errors = validate(req.body,rules)

    if(errors.length > 0){
        req.flash('error_msg', 'invalid fields')
        res.redirect('/admin/crud/category/')
    }else{

        Category.updateOne({_id:req.body.categoryId},{category:req.body.newCategoryName}).then(()=>{
            req.flash('success_msg', 'Category updated successfuly!')
            res.redirect('/admin/crud/category/')
        }).catch((err)=>{
            req.flash('error_msg', 'error updating category: '+err)
            res.redirect(`/admin/crud/category/update/${req.body.categoryId}`)
        })
    }  
})

//* Delete category
router.post('/delete', async (req,res)=>{
    const categoryId = req.body.categoryId

    if (!categoryId){
        req.flash('error_msg', 'No category detected')
        res.redirect('/admin/crud/category', {message:'No category detected'})
    }

    Category.deleteOne({_id:categoryId}).then(()=>{
        console.log('success')
        req.flash('success_msg', 'Category deleted successfuly')
        res.redirect('/admin/crud/category')
    })
})

module.exports = router