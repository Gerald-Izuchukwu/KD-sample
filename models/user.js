const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// vaccine schema for each vaccine administered to a child
const vaccineSchema = new mongoose.Schema({
    vaccine_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vaccine'
    },
    dateAdministered : {
        type : Number
    },
    doseAdministered : {
        type : Number
    }
})

// children schema for each child/ward of the parent
const childrenSchema = new mongoose.Schema({
    surname : {
        type : String
    },

    dateOfBirth :{
        type : Number,
        required : true
    },

    // nested vaccine schema for the vaccine administered to the child
    vaccine : [vaccineSchema]
})

// token schema
const tokenSchema = new mongoose.Schema({
    token : {
        type : String
    }
})

const userSchema = new mongoose.Schema({
    fullName :{
        type : String
    },
    
    userName : {
        type : String,
        required : true
    }, 

    email : {
        type : String,
        required : true,
        unique : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid emiail')
            }
        }
    },

    password : {
        type : String,
        required : true,
        unique : false,
        validate(value){
            if (value.length < 8){
                throw new Error('Password must not be less than 8 characters')
            }
        }
    },

    sex : {
        type : String,
        required : false,
        validate(value){
            if(value!== "male" || value!== "female") {
                throw new Error ("sex not accepted")
            }
        }
    },

    numberOfChildren : {
        type : Number,
        required : true

    },

    children : [childrenSchema],

    tokens : [tokenSchema],

    isAdmin : {
        type : Boolean,
        default : false
    }
})

//static function to find a user
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Email Doesnt match')
    }
    //checking hashed password
    const validPassword =await  bcrypt.compare(password, user.password)
    if (!validPassword) {
        throw new Error('Incorrect Password')
    }
    return user
}

//normal method function to find a user
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({id: this._id}, 'vaccine')
    this.tokens.push({token: token})
    await this.save()
    return token
}

//I didnt use arrow function here cause of 'this' binding
userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')) {
        const hashPassword = await bcrypt.hash(user.password, 8)
        user.password = hashPassword
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User