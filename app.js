//Imports
    const express = require('express')
    const app = express()

    const hbs = require('express-handlebars')
    const mongoose = require('mongoose') 
    const flash = require('connect-flash')
    const path = require('path')

    const session = require('express-session')
    const passport = require('passport')

    //rotas
        const admin = require('./routes/admin')
        const account = require('./routes/account')
        const posts = require('./routes/posts')
        const errors = require('./routes/errors')

//Configs
    //Session
        app.use(session({
            secret: 'SegredoSecreto',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //Middleware

        //bodyparser
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        //custom
        app.use((req,res,next)=>{
            console.log(`Loading ${req.url}`)
            next()
        })

        //flash
        app.use((req,res,next)=>{

            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error_code = req.flash('error_code')
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
    app.use('/posts', posts)
    app.use('/errors', errors)

app.get('/', (req,res, next)=>{
    try{
        res.render('index')
    }catch(err){
        next(err)
    }
    
})

//middleware for errors
app.use((err, req, res, next) => {
    console.error(err.stack)
    if (!res.headersSent) {
        req.flash('error_msg', `${err.message}`)
        req.flash('error_code', `${err.status || 500}`)
        res.status(err.status || 500).redirect('/errors')
    }
})

//App starting
    const PORT = 8081
    app.listen(PORT, ()=>{
        console.log(`Server running at http://Localhost:${PORT}`)
    })