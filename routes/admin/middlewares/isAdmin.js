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
                req.flash('error_msg', 'Access denied: You are not an admin.')
                return res.redirect('/')
            }
        } else {
            req.flash('error_msg', 'Please log in to view this resource.')
            return res.redirect('/')
        }
    } catch (err) {
        console.error('Error checking admin privileges:', err)
        req.flash('error_msg', 'An error occurred while checking privileges.')
        return res.redirect('/')
    }
}