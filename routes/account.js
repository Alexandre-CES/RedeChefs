//Requires
    const express = require('express')
    const router = express.Router()

    const mongoose = require('mongoose')
    const bcrypt = require('bcrypt')

    const passport = require('passport')
    const initializePassport = require('../config/auth')

    initializePassport(passport)

    require('../models/user/User')
    require ('../models/user/Status')



//Models
    const User = mongoose.model('users')
    const Status = mongoose.model('status')


//Rotas

router.get('/', (req,res) =>{
    
    if(req.isAuthenticated()){
        const profile = req.user
        res.render('account/index', {profile:profile})
    }else{
        res.render('account/index')
    }
})

router.get('/user/:user', (req,res) =>{

    const requestedUser = req.params.user;
    
    if(req.isAuthenticated()){
        const profile = req.user

        if(profile.user === requestedUser){
            res.redirect('/account/')
        }else{
            User.findOne({user:requestedUser}).lean().then((person)=>{
                res.render('account/index', {profile:person})
            }).catch((err)=>{
                res.redirect('/')
            })
        }
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
        let errors = []

        let user = req.body.user
        let username = req.body.username || user
        let email = req.body.email
        let password = req.body.password
        let confirm_password = req.body.confirm_password

        if (
            !user || user == undefined || user == null 
            || user.length < 5 || user.length > 20 ||
            !password || password == undefined || password == null 
            || password.length < 5 || password.length > 30 ||
            !confirm_password || confirm_password == undefined || confirm_password == null 
            || confirm_password.length < 5 || confirm_password.length > 30
        ) {
            errors.push('Invalid fields, fill correctly all required ones')
        }

        if (errors.length > 0) {
            res.render('account/register', { hide_menu: true, errors: errors })
        } else {
            try {
                const existingUser = await User.findOne({ user: user })
                if (existingUser) {
                    errors.push('User already exists!')
                    res.render('account/register', { hide_menu: true, errors: errors })
                    return
                }

                if (email) {
                    const existingEmailUser = await User.findOne({ email: email })
                    if (existingEmailUser) {
                        errors.push('Email already being used!')
                        res.render('account/register', { hide_menu: true, errors: errors })
                        return
                    }
                }

                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(password, salt)

                const userData = {
                    username: username,
                    user: user,
                    password: hash,
                    email: email || null
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
        res.render('account/register', { hide_menu: true })
    }
})

router.all('/login', (req, res, next)=>{
    if(req.method == 'POST'){
        console.log(req.body);
        passport.authenticate('local', {
            successRedirect:'/',
            failureRedirect:'/account/login',
            failureFlash: true
        })(req,res,next)
    }else{
        res.render('account/login', {hide_menu:true})
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