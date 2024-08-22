const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/post/Post')
require('../models/post/Category')
require('../models/post/Image')
const Post = mongoose.model('posts')
const Category = mongoose.model('categories')
const Image = mongoose.model('images')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const { validate } = require('../helpers/validateReqBody')

router.get('/post/:id', async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id).populate('image').lean()
        if (post.image) {
            post.imageSrc = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`
        }
        res.render('posts/index', { post })
    }catch(err){
        req.flash('error_msg','error: '+err)
        res.redirect('/')
    }
})

router.all('/new', async (req,res)=>{
    if(req.isAuthenticated()){
        if(req.method == 'POST'){
            console.log(req.body)
            //validate form
            const rules = {
                title: { required: true, minLength: 1, maxLength: 50 },
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
                        ingredients: splitIngredients,
                        method: req.body.method,
                    }

                    //optional values
                    if(req.body.description){
                        postData.description = req.body.description
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

                    await new Post(postData).save().then((post)=>{
                        console.log('Post created successfuly')
                        res.redirect(`/posts/upload-image/${post._id}`)
                    }).catch((err)=>{
                        console.log('Error crating post: '+err)
                        res.redirect('/posts/new')
                    })

                }catch(err){
                    req.flash('error_msg', 'Error creating post: '+err)
                    console.log('error creatint post: '+err)
                }
            }
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

router.get('/upload-image/:postId', async (req,res)=>{
    res.render('posts/image', {postId:req.params.postId})
})

router.post('/upload-image/:postId', upload.single('postImage'), async (req, res) => {
    try {
        if (!req.file) {
            req.flash('error_msg', 'Nenhuma imagem foi enviada.')
            //return res.redirect(`/posts/edit/${req.params.postId}`)
            return res.redirect('/')
        }

        const newImage = new Image({
            data: req.file.buffer,
            contentType: req.file.mimetype
        })
        const savedImage = await newImage.save().then(()=>{
            console.log('image saved successfuly')
        })

        await Post.findByIdAndUpdate(req.params.postId, { image: savedImage._id })

        //res.redirect(`/post/${req.params.postId}`)
        res.redirect('/')
    } catch (err) {
        req.flash('error_msg', 'Erro ao fazer upload da imagem: ' + err.message)
        //res.redirect(`/posts/edit/${req.params.postId}`)
        res.redirect('/')
    }
});

module.exports = router