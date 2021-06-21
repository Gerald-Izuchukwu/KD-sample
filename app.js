const express = require('express')

const app = express()

// middleware to recognize the incoming Request Object as a JSON Object
app.use(express.json())

const PORT = process.env.PORT || 4001


/* this code would run if something goes wrong
if the status code is equal to 200  that means its an internal server error 
hence it would return an error code of 500

if the status code isnt 200, it would return the statuscode*/

app.use(async(err,req,res,next)=>{
    const errCode = res.statusCode===200?500:res.statusCode
    res.status(errCode)
    
    const error = {
        message: err.message,
        stack: err.stack
    }
    res.send(error)
})

// running the server 
app.listen(PORT, ()=>{
    console.log(`server is running on port : ${PORT}`)
})