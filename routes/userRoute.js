const express = require('express')
const User = require('../models/user')
const router = express.Router()
const Auth = require('../middleware/auth')

//route: /user/signup
//to sign up a new user. 
router.post('/signUp', async(req, res, next)=>{
    try {
        // creating and saving the users data
        const data = req.body
        const newUser = new User(data) 
        await newUser.save()

        res.status(200).send("Data has been saved, Please log in to get access token")

    } catch (error) {
        next(error)
        
    }
})


//route: /user/signin
//to sign in a new user via username and password. authentication token would be sent as a response
router.post('/signIn', async(req, res, next)=>{
    try {
        const verifyData = req.body
        const validUser = await User.findByCredentials(verifyData.email, verifyData.password)
        const token = await validUser.generateAuthToken()
        const user = validUser.toObject()

        delete user.password
        delete user.tokens
        delete user.children
        res.send({user, token})
    } catch (error) {
        next(error)
        
    }
})

// to get the profile of the user

router.get('/userProfile', Auth, async(req, res, next)=>{
    try {
        const user = req.user
        // to populate virtual vaccine db
        await user.populate('children.vaccineDetails.vaccine_id').execPopulate()
        
        const userProfile = user.toObject() 

        delete userProfile.isAdmin
        delete userProfile.tokens
        delete userProfile.password
        res.send(userProfile)   
    } catch (error) {
        next(error)
        
    }
})

module.exports = router