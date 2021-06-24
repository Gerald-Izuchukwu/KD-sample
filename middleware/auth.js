const webToken = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next)=>{
    try {
        const token = req.head('Authorization').replace('Bearer', "")
        console.log(token)
        const {id} = webToken.verify(token, 'vaccine')
        const user = await User.findOne({_id : id})

        if(!user){
            throw new error
        }
        req.user = user
        next()
    } catch (error) {
        const err = new Error('Please Re-Authenticate')
        console.log(error);
        next(err)
        
    }
}

module.exports =auth