const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const passport = require('passport')
const initializePassport = require('../../config/auth')
initializePassport(passport)

const { validate } = require('../../helpers/validateReqBody')

//Models
require('../../models/user/User')
require ('../../models/user/Status')
const User = mongoose.model('users')
const Status = mongoose.model('status')

router.all('/register', async (req, res) => {
    if (req.method == 'POST') {
        let rules = {
            user:{required:true, minLength:5, maxLength:20},
            password:{required:true, minLength:5, maxLength:30},
            confirm_password:{required:true, minLength:5, maxLength:30}
        }

        if(req.body.email){
            rules.email = { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
        }

        const errors = validate(req.body, rules)

        if(req.body.confirm_password != req.body.password){
            errors.push('passwords must match')
        }

        if (errors.length > 0) {
            console.log(errors)
            req.flash('error_msg', errors.join(',<br>'))
            res.redirect('/account/auth/register')
        } else {

            //username = user if you leave the field blank
            let username = req.body.username || req.body.user

            try {
                //check if user already exist
                const existingUser = await User.findOne({ user: req.body.user })
                if (existingUser) {
                    req.flash('error_msg','User already exists!')
                    return res.redirect('/account/auth/register')
                }

                //encrypting password
                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(req.body.password, salt)

                let userData = {
                    username: username,
                    user: req.body.user,
                    password: hash,
                }

                //check if email already exist
                if (req.body.email) {
                    const existingEmail = await User.findOne({ email: req.body.email })
                    if (existingEmail) {
                        req.flash('error_msg','Email already being used!')
                        return res.redirect('/account/auth/register')
                    }else{
                        userData.email = req.body.email
                    }
                }

                const savedUser = await new User(userData).save()

                const userStatusData = {
                    user: savedUser._id
                }

                await new Status(userStatusData).save()
                console.log('User status created successfully')
                req.flash('success_msg', 'User created successfully')
                res.redirect('/account/auth/login')

            } catch (err) {
                console.error('Error creating user:', err)
                req.flash('error_msg', 'Error creating user')
                return res.redirect('/account/auth/register')
            }
        }
    } else {
        res.render('account/register', {hide_menus: true})
    }
})

router.all('/login', (req, res, next)=>{
    if(req.method == 'POST'){
        console.log(req.body);
        passport.authenticate('local', {
            successRedirect:'/',
            failureRedirect:'/account/auth/login',
            failureFlash: true,
        })(req,res,next)
    }else{
        res.render('account/login', {hide_menus:true, error: req.flash('error')})
    }
})

router.get('/logout', (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }    
        req.flash('success_msg','Bye')
        res.redirect("/")
    })
})

module.exports = router