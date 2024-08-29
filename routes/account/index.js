    const express = require('express')
    const router = express.Router()

    const mongoose = require('mongoose')

    const passport = require('passport')
    const initializePassport = require('../../config/auth')
    initializePassport(passport)

//Models
    require('../../models/user/User')
    require('../../models/user/Follower')
    require('../../models/user/Following')
    require('../../models/post/Post')
    const User = mongoose.model('users')
    const Follower = mongoose.model('followers')
    const Following = mongoose.model('following')
    const Post = mongoose.model('posts')

//Rotas
router.get('/', async (req,res) =>{
    
    try{
        if(req.isAuthenticated()){
            const profile = req.user

            const followersCount = await Follower.countDocuments({user:profile._id})
            const followingsCount = await Following.countDocuments({user:profile._id})
            const postsCount = await Post.countDocuments({user:profile._id})

            res.render('account/index', {
                profile:profile,
                followersCount:followersCount,
                followingCount:followingsCount,
                postsCount:postsCount,
                followButton:false,
            })
        }else{
            res.render('account/index')
        }
    }catch(err){
        res.render('errors/index',{errorMessage:err})
    }
})

router.get('/user/:user', async (req,res) =>{

    const requestedUser = req.params.user;
    
    if(req.isAuthenticated()){
        const profile = req.user

        //if user is acessing his own profile
        if(profile.user === requestedUser){
            res.redirect('/account/')
        }else{

            try{
                
                const person = await User.findOne({ user:requestedUser }).lean()
                if (!person) {
                    req.flash('error_msg','User unavalible')
                    return res.redirect('/')
                }

                const followersCount = await Follower.countDocuments({user:person._id})
                const followingsCount = await Following.countDocuments({user:person._id})
                const postsCount = await Post.countDocuments({user:profile._id})

                res.render('account/index', {
                    profile:person,
                    followersCount:followersCount,
                    followingCount:followingsCount,
                    postsCount:postsCount,
                    followButton:true
                })

            } catch (err){
                req.flash('error_msg', err)
                res.redirect('/')
            }
        }

    //if user not logged, just show the account
    }else{
        User.findOne({user:requestedUser}).lean().then((person)=>{
            res.render('account/index', {profile:person})
        }).catch((err)=>{
            req.flash('error_msg',err)
            res.redirect('/')
        })
    }

})

router.get('/config', (req,res)=>{
    res.render('account/config')
})

module.exports = router