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
    res.render('account/index')
})

router.all('/register', (req, res)=>{
    if(req.method == 'POST'){
        let errors = []

        let user = req.body.user
        let username = req.body.username
        if(!username){username = user}
        let email = req.body.email
        let password = req.body.password
        let confirm_password = req.body.confirm_password

        if(
            !user || user == undefined || user == null 
            || user.length < 5 || user.length > 20 ||

            !password || password == undefined || password == null 
            || password.length < 5 || password.length > 30 ||

            !confirm_password || confirm_password == undefined || confirm_password == null 
            || confirm_password.length < 5 || confirm_password.length > 30
        ){
            errors.push('Invalid fields, fill correctly all required ones')
        }

        if(password != confirm_password){
            errors.push('Password must be the same!')
        }

        if(errors.length > 0){
            res.render('account/register', { hide_menu: true, errors: errors })
        }else{

            User.findOne({user:user}).then((user)=>{
                if(user){
                    errors.push('user already exist!')
                    res.render('account/register', { hide_menu: true, errors: errors })
                }else if(email && email != undefined && email != null && email > 10){
                    User.findOne({email:email}).then((user)=>{
                        if(user){
                            errors.push('email already been used!')
                            res.render('account/register', { hide_menu: true, errors: errors })
                        }
                    })
                }
            })

            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            const userData ={
                username : username,
                user: user,
                password: hash
            } 

            if (email && email.trim() !== '') {
                userData.email = email
            }
                
            new User(userData).save().then(()=>{
                console.log('user created successfuly')
            })
            
    
            res.redirect('/account/login')
            
        }  

    }else{
        res.render('account/register', {hide_menu:true})
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

module.exports = router