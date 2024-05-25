const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const errorMessage = req.flash('error_msg')
    let errorCode = req.flash('error_code')
    
    res.render('errors/index', { errorMessage: errorMessage[0] || 'Something went wrong',
     hide_top_menu:true,
     errorCode: errorCode[0] || 500
    })
})

module.exports = router