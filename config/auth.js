/*
    *Session and authentication

    TODO: Not letting banned users to actually log in their account
*/

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
require('../models/user/User')
require('../models/user/Status')
const User = mongoose.model('users')
const Status = mongoose.model('status')

const { validate } = require('../helpers/validateReqBody')

module.exports = (passport) =>{
    passport.use(new LocalStrategy({
        usernameField:'user', 
        passwordField:'password'
    },(user, password, done) =>{

        //validate form
        const rules ={
            user: {required:true, minLength:5, maxLength:20},
            password:{required:true, minLength:5, maxLength:30}
        }
        const errors = validate({user,password}, rules)

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