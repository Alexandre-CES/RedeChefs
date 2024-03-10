// Session and authentication

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
require('../models/user/User')
require('../models/user/Status')
const User = mongoose.model('users')
const Status = mongoose.model('status')

module.exports = (passport) =>{
    passport.use(new LocalStrategy({
        usernameField:'user', 
        passwordField:'password'
    },(user, password, done) =>{
        let errors = []

        if(
            !user || user == undefined || user == null 
            || user.length < 5 || user.length > 20 ||

            !password || password == undefined || password == null 
            || password.length < 5 || password.length > 30 

        ){
            errors.push('Invalid fields')
        }

        if(errors.length > 0){
            return done(null, false, { message: 'Invalid fields' })
        }else{

            User.findOne({user:user}).lean().then((person)=>{
                if(!person){
                    return done(null,false,{message:'This account does not exist!'})
                }else{

                    bcrypt.compare(password, person.password, (err, result)=>{
                        if(err){

                            return done(err)
                        }
                        if (result){
                            return done(null, person)
                        }else{
                            return done(null, false, {message: 'Incorrect password'})
                        }
                    })
                }
            }).catch((err)=>{
                return done(err)
            })
        }

    }))

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id).lean().then((user)=>{
            done(null,user)
        }).catch((err)=>{
            done(err)
        })
    })
}