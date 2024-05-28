const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const errorMessage = req.flash('error_msg')
    let errorCode = req.flash('error_code')
    
    res.render('errors/index', { 
        errorCode: errorCode[0] || 500,
        errorMessage: errorMessage[0] || 'Something went wrong',
        hide_top_menu:true
    })
})

module.exports = router