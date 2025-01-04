/*
    Page related to reports

    TODO:
        -post form to resolve reports
        -page to see resolved reports
        -find a way to see if an user is reporting incorrectly
*/

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../../models/moderation/Report')
const Report = mongoose.model('reports')

/*
    *Page where admins can see reports

    TODO: give priority to things that were reported the most 
*/
router.get('/', async (req,res) =>{
    const reports = await  Report.find({status:'pending'}).lean()
    res.render('admin/reports/index', {reports:reports})
})

//see an specific report
router.all(`/report/:_id`, async (req,res)=>{
    if(req.method == 'POST'){

    }else{
        res.render('admin/reports/report')
    }
})

module.exports = router