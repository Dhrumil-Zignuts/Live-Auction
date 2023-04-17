const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

// Create a App
const app = express()

// Set Middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Check the API 
app.get('/',(req,res)=>{
    res.send('Hello Server')
})

// Requiring all Router
const user = require('./api/routes/userRoutes')


// Default Routes
app.use('/api/user', user)

// Connect the MongoDb Account
mongoose.connect(process.env.DB_URL)

// assigning POST value
const PORT = process.env.PORT || 3000;

// Listening App on given PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`);
})