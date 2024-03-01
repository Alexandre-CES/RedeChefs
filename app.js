//Imports
    const express = require('express')
    const app = express()
    const hbs = require('express-handlebars')
    const mongoose = require('mongoose') 

//Configs
    //Handlebars
        app.engine('hbs', hbs.engine({
            defaultLayout:'main'
        }))
        app.set('view engine', 'hbs')
    
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongo://127.0.0.1:27017/RedeChefs')


//App starting
    const PORT = 8081
    app.listen(PORT, ()=>{
        console.log(`Server running at http://Localhost:${PORT}`)
    })