//Imports
    const express = require('express')
    const app = express()
    const hbs = require('express-handlebars')
    const mongoose = require('mongoose') 

//Configs
    //Middle ware - flash
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')

            next()
        })
    //Handlebars
        app.engine('hbs', hbs.engine({
            defaultLayout:'main'
        }))
        app.set('view engine', 'hbs')
    
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongo://127.0.0.1:27017/RedeChefs').then(()=>{
            console.log('Mongo connected')
        }).catch((err)=>{
            console.log(`Couldn't connect database: ${err}`)
        })  


//App starting
    const PORT = 8081
    app.listen(PORT, ()=>{
        console.log(`Server running at http://Localhost:${PORT}`)
    })