//Imports
    const express = require('express')
    const app = express()
    const hbs = require('express-handlebars')
    const mongoose = require('mongoose') 
    const session = require('express-session')
    const flash = require('connect-flash')
    const path = require('path')

    //rotas
        const admin = require('./routes/admin')
        const account = require('./routes/account')

//Configs
    //Session
        app.use(session({
            secret: 'SegredoSecreto',
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash())
    //Middleware

        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        app.use((req,res,next)=>{
            console.log(`Loading ${req.url}`)
            next()
        })

        //flash
        app.use((req,res,next)=>{

            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
        
        //Static
        app.use(express.static(path.join(__dirname, 'public')))

    //Handlebars
        app.engine('hbs', hbs.engine({
            defaultLayout:'main',
            extname: 'hbs'
        }))
        app.set('view engine', 'hbs')
    
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://127.0.0.1:27017/RedeChefs').then(()=>{
            console.log('Mongo connected')
        }).catch((err)=>{
            console.log(`Couldn't connect database: ${err}`)
        })  

//Routes
    app.use('/admin', admin)
    app.use('/account', account)

app.get('/', (req,res)=>{
    res.render('index')
})

//App starting
    const PORT = 8081
    app.listen(PORT, ()=>{
        console.log(`Server running at http://Localhost:${PORT}`)
    })