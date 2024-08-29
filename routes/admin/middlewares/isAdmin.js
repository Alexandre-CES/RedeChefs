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