const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/post/Post')
require('../models/post/Category')
const Post = mongoose.model('posts')
const Category = mongoose.model('categories')

const { validate } = require('../helpers/validateReqBody')

router.get('/post/:id', async (req,res)=>{
    
    const id = req.params.id
    const post = await Post.findOne({_id:id}).lean()

    res.render('posts/index', {post:post})
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

                const rules = {
                    title: { required: true, minLength: 1, maxLength: 20 },
                    ingredients: { required: true, minLength: 1, maxLength: 1000 },
                    method: { required: true, minLength: 5, maxLength: 5000 },
                    description: { maxLength: 1000 },
                    diet: { required: true },
                    mealTimes: { required: true }
                }

                const errors = validate(req.body, rules)
                    
                if(errors.length > 0){
                    console.log(errors)
                    req.flash('error_msg', errors.join(', '))
                    res.redirect('/posts/new')
                }else{

                    try{
                        const user = req.user._id

                        var splitIngredients = req.body.ingredients.split(',')
                        var splitIngredients = splitIngredients.map(ingredient => ingredient.trim())

                        const postData = {
                            user: user,
                            title: req.body.title,
                            ingredients: req.body.splitIngredients,
                            method: req.body.method,
                        }

                        //optional values
                        if(description){
                            postData.description = req.body.description
                        }
                        if (req.file) {
                            postData.imagePath = req.file.path;
                        }

                        let categories = []

                        if(req.body.diet != 'none'){
                            var dietType = await Category.findOne({category:req.body.diet})

                            if (dietType){
                                categories.push(dietType._id)
                            }
                        }       
                        if(req.body.mealTimes != 'none'){
                            var dietType = await Category.findOne({category:req.body.mealTimes})

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
            let optMealTimes = [
                'Breakfast',
                'Lunch',
                'Snack',
                'Dinner'
            ]
            res.render('posts/new', {optdiet:optdiet, optMealTimes:optMealTimes})
        }
    }else{
        res.render('account/index', {message_error: 'Please, log in before post something!'})
    }
})

module.exports = router