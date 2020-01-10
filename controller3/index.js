var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session');
var emailExistence=require("email-existence")
var bcrypt = require('bcryptjs')
var validator = require('aadhaar-validator')
var nodemailer = require('nodemailer')
var router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))

const contact=require('../controller1/contactschema')
const cause=require('../controller1/causeschema')
const event=require('../controller1/eventschema')
const volunteer=require('../controller1/volunteerschema')
const donater=require('../controller1/donaterschema')
const admin=require('../controller3/adminschema')
const ngo=require('../controller2/ngoschema')
const donaterdetails=require('../controller1/donaterdetailsschema')
const donateitem=require('../controller1/donateitemschema')
const exchangeitem=require('../controller1/exchangeitemschema')
router.use(express.static('./photo/admin'))
router.use(express.static('./photo/cause'))
router.use(express.static('./photo/event'))
router.use(express.static('./photo/item'))
router.use(express.static('./photo'))
router.use(express.static('./public'))
router.use(express.static('./public/main'))
router.use(express.static('./public/images'))
const stripe=require('stripe')('sk_test_yExHf3wBKdngIjOSCcDS2ypx00j4wKViOo')
router.use(session({
  secret: 'secret',
 cookie:{maxAge:1000*60*5},
  resave: true,
  saveUninitialized: true
}));

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhrabag999@gmail.com',
    pass: 'Abhraneel@1'
  }
});
router.get('/',(req,res)=>{
  res.render('admin-login.ejs',{name:'a'})
})
router.post('/checkadmin',(req,res)=>{
  admin.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
    bcrypt.compare(req.body.password,data.pd, function(err, doesMatch){
      if (doesMatch){
        req.session.logtype="3";
        req.session.name=data.name;
        req.session.email=data.email;
        req.session.photo=data.photo;
        ngo.find({status:{$eq:0}},function(err,data2)
        {
          cause.find({},function(err,data3)
          {
            event.find({upcoming:{$eq:1}},function(err,data4)
            {
              donateitem.find({$or:[{status:{$eq:1},status:{$eq:2}}]},function(err,data5)
            {
              res.render('admin-home',{data,data2,data3,data4,data5,photo:req.session.photo,name:req.session.name,work:req.session.work})
            })
          
            })
          })

        })
       
      }
      else{
        res.render('admin-login')
      }
    })
  }
})
})
router.get('/causea',(req,res)=>{
  cause.find({},function(err,data)
          {
  res.render('causea.ejs',{photo:req.session.photo,name:req.session.name,work:req.session.work,data})
          })
})
module.exports = router