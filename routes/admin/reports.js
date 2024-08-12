const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../models/moderation/Report')
const Report = mongoose.model('reports')

router.get('/', async (req,res) =>{
    const reports = await  Report.find({status:'pending'}).lean()
    res.render('admin/reports/index', {reports:reports})
})

router.all(`/report/:_id`, async (req,res)=>{
    if(req.method == 'POST'){

    }else{
        res.render('admin/reports/report')
    }
})

module.exports = router