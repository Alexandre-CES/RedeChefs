/*
    *Check if user is admin

    pages related to admins can only by accessed by admins, so this checks every time you make a request to see if you are a admin before letting you access. 
*/

const mongoose = require('mongoose')
require('../../../models/moderation/Admin')
const Admin = mongoose.model('admins')

module.exports = async (req,res,next)=>{
    try {
        //verify if is authenticated
        if (req.isAuthenticated()) {
            const userId = req.user._id

            // verify if is admin
            const adminUser = await Admin.findOne({ user: userId })
            if (adminUser) {
                return next()
            } else {
                return res.redirect('/')
            }
        } else {
            return res.redirect('/')
        }
    } catch (err) {
        req.flash('error_msg', 'An error occurred while checking privileges: '+err)
        return res.redirect('/')
    }
}