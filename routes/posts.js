const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/post/Post')
require('../models/post/Category')
const Post = mongoose.model('posts')
const Category = mongoose.model('categories')

router.get('/post/:id', (req,res)=>{
    res.render('posts/index')
})

router.all('/new', async (req,res)=>{
    if(req.isAuthenticated()){
        if(req.method == 'POST'){

            //it needs to be loaded before anything for some reason
            req.upload.single('postImage')(req, res, async (err) => {
                if (err) {
                    req.flash('error_msg', 'error uploading image')
                    res.redirect('/errors/')
                }

                let errors = []

                const title = req.body.title
                const ingredients = req.body.ingredients
                const method = req.body.method
                const description = req.body.description
                const diet = req.body.diet
                const mealTimes = req.body.mealTimes

                if(
                    !title || title == undefined || title == null 
                    || title.length < 1 || title.length > 20
                ){
                    errors.push('Invalid title')
                }else if(
                    !ingredients || ingredients == undefined || ingredients == null 
                    || ingredients.length < 1 || ingredients.length > 1000
                ){
                    errors.push('Invalid ingredient field')
                }else if(
                    !method || method == undefined || method == null 
                    || method.length < 5 || method.length > 5000
                ){
                    errors.push('Invalid method field')
                } else if(description.length > 1000){

                    errors.push('Invalid description')
                }else if(
                    !diet || diet == undefined || diet == null ||
                    !mealTimes || mealTimes == undefined || mealTimes == null 
                ){
                    errors.push('Invalid additionals')
                }
                    
                if(errors.length > 0){
                    console.log(errors)
                    res.redirect('/posts/new')
                }else{

                    try{
                        const user = req.user._id

                        var splitIngredients = ingredients.split(',')
                        var splitIngredients = splitIngredients.map(ingredient => ingredient.trim())

                        const postData = {
                            user: user,
                            title: title,
                            ingredients: splitIngredients,
                            method: method,
                        }

                        if(description){
                            postData.description = description
                        }

                        if (req.file) {
                            postData.imagePath = req.file.path;
                        }

                        let categories = []

                        if(diet != 'none'){
                            var dietType = await Category.findOne({category:diet})

                            if (dietType){
                                categories.push(dietType._id)
                            }
                        }       
                        if(mealTimes != 'none'){
                            var dietType = await Category.findOne({category:mealTimes})

                            if (dietType){
                                categories.push(dietType._id)
                            }
                        }

                        if (categories.length > 0){
                            postData.categories = categories
                        }

                        await new Post(postData).save().then(()=>{
                            console.log('Post created successfuly')
                            res.redirect('/')
                        }).catch((err)=>{
                            console.log('Error crating post: '+err)
                            res.redirect('/posts/new')
                        })

                        

                    }catch(err){
                        req.flash('error_msg', 'Error creating post: '+err)
                        console.log('error creatint post: '+err)
                    }
                }
            })
        }else{
            let optdiet = ['Vegan', 'Vegetarian']
            let optMealTimes = ['Breakfast', 'Lunch', 'Snack', 'Dinner']
            res.render('posts/new', {optdiet:optdiet, optMealTimes:optMealTimes})
        }
    }else{
        res.render('account/index', {message_error: 'Please, log in before post something!'})
    }
})

module.exports = router