const express=require('express')
const app=express()
var mongoose=require('mongoose')

 mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true });
var user = require('./controller1/home.js')
app.use('/',user)
var admin= require('./controller3/index.js')
app.use('/admin',admin)

app.set('view engine','ejs')

      
app.listen(3000,(req,res)=>{
    console.log('port 3000')
})