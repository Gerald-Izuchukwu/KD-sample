const mongoose = require("mongoose")
require('dotenv').config()

const mongo_URI = process.env.mongo_URI || 'mongodb://localhost:27017/KDVac_Sample'

const connectionDB = async () => {
    try {
        const connection = await mongoose.connect(mongo_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex: true,
            useFindAndModify : false
        })
        console.log(`the server is connected on ${connection.connection.host}`)
        
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = connectionDB