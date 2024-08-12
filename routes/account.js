    const express = require('express')
    const router = express.Router()

    const mongoose = require('mongoose')
    const bcrypt = require('bcrypt')

    const passport = require('passport')
    const initializePassport = require('../config/auth')
    initializePassport(passport)

    const { validate } = require('../helpers/validateReqBody')

//Models
    require('../models/user/User')
    require ('../models/user/Status')
    require('../models/user/Follower')
    require('../models/user/Following')
    const User = mongoose.model('users')
    const Status = mongoose.model('status')
    const Follower = mongoose.model('followers')
    const Following = mongoose.model('following')

//Rotas
router.get('/', (req,res) =>{
    
    if(req.isAuthenticated()){
        const profile = req.user
        res.render('account/index', {profile:profile, followButton:false})
    }else{
        res.render('account/index')
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
                    res.redirect('/')
                    return
                }

                const [followersCount, followingCount] = await Promise.all([
                    Follower.countDocuments({user:person._id}),
                    Following.countDocuments({user:person._id})
                ])

                res.render('account/index', {
                    profile:person,
                    followersCount:followersCount,
                    followingCount:followingCount,
                    followButton:true
                })

            } catch (err){
                req.flash('error_msg', 'Error fetching user data')
                console.log(err)
                res.redirect('/')
            }
        }

    //if user not logged, just show the account
    }else{
        User.findOne({user:requestedUser}).lean().then((person)=>{
            res.render('account/index', {profile:person})
        }).catch((err)=>{
            res.redirect('/')
        })
    }

})

router.all('/register', async (req, res) => {
    if (req.method == 'POST') {

        const rules = {
            user:{required:true, minLength:5, maxLength:20},
            password:{required:true, minLength:5, maxLength:30},
            confirm_password:{required:true, minLength:5, maxLength:30}
        }

        const errors = validate(req.body, rules)

        if(req.body.confirm_password != req.body.password){
            errors.push('passwords must match')
        }

        if (errors.length > 0) {
            console.log(errors)
            req.flash('error_msg', errors.join(', '))
            res.render('account/register', { hide_menus: true, errors: errors, message: req.flash('error_msg') })
        } else {

            let username = req.body.username || req.body.user

            try {
                const existingUser = await User.findOne({ user: req.body.user })
                if (existingUser) {
                    errors.push('User already exists!')
                    res.render('account/register', { 
                        hide_menus: true,
                        errors: errors,
                        message: req.flash('error') 
                    })
                    return
                }

                if (req.body.email) {
                    const existingEmailUser = await User.findOne({ email: req.body.email })
                    if (existingEmailUser) {
                        errors.push('Email already being used!')
                        res.render('account/register', { hide_menus: true, errors: errors })
                        return
                    }
                }

                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(req.body.password, salt)

                const userData = {
                    username: username,
                    user: req.body.user,
                    password: hash,
                    email: req.body.email || null
                }

                const savedUser = await new User(userData).save()
                console.log('User created successfully:', savedUser)

                const userStatusData = {
                    user: savedUser._id
                }

                await new Status(userStatusData).save()
                console.log('User status created successfully')
                req.flash('success_msg', 'User created successfully')
                res.redirect('/account/login')

            } catch (err) {
                console.error('Error creating user:', err)
                req.flash('error_msg', 'Error creating user')
                res.redirect('/account/register')
            }
        }
    } else {
        res.render('account/register', { hide_menus: true })
    }
})

router.all('/login', (req, res, next)=>{
    if(req.method == 'POST'){
        console.log(req.body);
        passport.authenticate('local', {
            successRedirect:'/',
            failureRedirect:'/account/login',
            failureFlash: true,
        })(req,res,next)
    }else{
        res.render('account/login', {hide_menus:true, message: req.flash('error')})
    }
})

router.get('/logout', (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }    
        req.flash('success_msg','')
        res.redirect("/")
    })
})

router.get('/config', (req,res)=>{
    res.render('account/config')
})

module.exports = router