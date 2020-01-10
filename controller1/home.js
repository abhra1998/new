var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session');
var emailExistence=require("email-existence")
var bcrypt = require('bcryptjs')
var validator = require('aadhaar-validator')
var nodemailer = require('nodemailer')
var router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))


const contact=require('./contactschema')
const cause=require('./causeschema')
const event=require('./eventschema')
const volunteer=require('./volunteerschema')
const donater=require('./donaterschema')
const ngo=require('../controller2/ngoschema')
const donaterdetails=require('./donaterdetailsschema')
const donateitem=require('./donateitemschema')
const exchangeitem=require('./exchangeitemschema')
router.use(express.static('./photo/cause'))
router.use(express.static('./photo/event'))
router.use(express.static('./photo/item'))
router.use(express.static('./photo'))
router.use(express.static('./public'))
router.use(express.static('./public/cause'))
const stripe=require('stripe')('sk_test_yExHf3wBKdngIjOSCcDS2ypx00j4wKViOo')
router.use(session({
  secret: 'secret',
 cookie:{maxAge:1000*60*5},
  resave: true,
  saveUninitialized: true
}));
const auth1=function(req,res,next){
  if(req.session.logtype=='1')
     next();
     else
     res.render('login',{name:req.session.name})
  }
  const auth2=function(req,res,next){
    if(req.session.logtype=='2')
       next();
       else
       res.render('login-ngo',{name:req.session.name})
    }
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhrabag999@gmail.com',
    pass: 'Abhraneel@1'
  }
});
router.get('/',(req,res)=>{
  
  cause.find({upcoming:{$eq:1}},function(err,data)
  {
      event.find({upcoming:{$eq:1}},function(err,data2)
         {
      res.render('main',{data,data2,name:req.session.name,logtype:req.session.logtype})
         }).limit(2) 
    
  }).limit(3) 
})
router.post('/',(req,res)=>{

  res.redirect('/')
})
//cause start
router.get('/cause',(req,res)=>{
  cause.find({upcoming:{$eq:"1"}},function(err,data)
  {
   
    if(data){
      res.render('cause',{data,name:req.session.name,logtype:req.session.logtype})
    }
  }) 
  
})
router.post('/charge',(req,res)=>{
  cause.findOne({name:{$eq:req.body.name}},function(err,data)
  {
    var token=req.body.stripeToken;
    var chargeAmount=req.body.amt;
    var charge=stripe.charges.create({
      amount:chargeAmount,
      currency:"USD",
      source:token

    },function(err,charge){
      if(err)
      {
        cause.find({upcoming:{$eq:"1"}},function(err,data)
  {
   
    if(data){
    
      res.render('cause',{data,alert:"1",name:req.session.name,logtype:req.session.logtype})
    }
  })
      }
      else
      {
        data.collectmoney = data.collectmoney+req.body.amt;
        data.save();
        cause.find({upcoming:{$eq:"1"}},function(err,data)
        {
         
          if(data){
          
            res.render('cause',{data,alert:"0",name:req.session.name,logtype:req.session.logtype})
          }
        })
      }
      
    })
  }) 
  
})
router.post('/charge2',(req,res)=>{
  cause.findOne({name:{$eq:req.body.name}},function(err,data)
  {
    var token=req.body.stripeToken;
    var chargeAmount=req.body.amt;
    var charge=stripe.charges.create({
      amount:chargeAmount,
      currency:"USD",
      source:token

    },function(err,charge){
      if(err)
      {
        cause.find({upcoming:{$eq:"1"}},function(err,data)
        {
            event.find({upcoming:{$eq:"1"}},function(err,data2)
               {
            res.render('main',{data,data2,alert:"1",name:req.session.name,logtype:req.session.logtype})
               }).limit(2) 
          
        }).limit(3) 
      }
      else
      {
        data.collectmoney = data.collectmoney+req.body.amt;
        data.save();
        cause.find({upcoming:{$eq:"1"}},function(err,data)
        {
            event.find({upcoming:{$eq:"1"}},function(err,data2)
               {
            res.render('main',{data,data2,alert:"0",name:req.session.name,logtype:req.session.logtype})
               }).limit(2) 
          
        }).limit(3) 
      }
      
    })
  }) 
  
})
//cause end
//about start
router.get('/about',(req,res)=>{

  res.render('about',{name:req.session.name,logtype:req.session.logtype})
})
//about end
//Contact start
router.get('/contact',(req,res)=>{
  res.render('contact',{name:req.session.name,logtype:req.session.logtype})
})
router.post('/contact2',(req,res)=>{
  var cont = new contact({
      
    name:req.body.name,
     email:req.body.email,
  
      subject:req.body.subject,
      message:req.body.message
   });
   cont.save();
  res.render('contact',{alert:"1",name:req.session.name,logtype:req.session.logtype})
})
//contact end
//start event
router.get('/event1',(req,res)=>{
  event.find({upcoming:{$eq:"1"}},function(err,data)
  {
    if(data){  
  res.render('event1',{data,name:req.session.name,logtype:req.session.logtype})
    }
  })
})

//end event
//donate start

router.get('/donate',(req,res)=>{
 
if(req.session.logtype=='2'){
  console.log('>>>')
  res.redirect('/ngo-donate')
}
else if(req.session.logtype=="1")
{
  donater.findOne({email:{$eq:req.session.email}},function(err,data)
  {
    if(data){
  res.render('donate1',{name:req.session.name,data,logtype:req.session.logtype})
    }
  })
}
else{
  res.render('login',{alert2:"1",name:req.session.name})
}

})
router.post('/donate2',auth1,(req,res)=>{
  donaterdetails.findOne({email:{$eq:req.session.email}},function(err,data)
  {
    if(data){
      
      data.phone=req.body.phone;
      data.lon=req.body.lon;
      data.lat=req.body.lat;
      data.add1=req.body.address1;
      data.add2=req.body.address2;
      data.landmark=req.body.landmark;
      data.pincode=req.body.pincode;
      data.city=req.body.city;
      data.save();
    }
    else{
      var newdonater = new donaterdetails({            
    email:req.body.email,
    phone:req.body.phone,
    lon: req.body.lon,
    lat: req.body.lat,
    add1: req.body.address1,
    add2: req.body.address2,
    landmark: req.body.landmark,
    pincode:req.body.pincode,
    city: req.body.city
                   });
   newdonater.save();
    }
  })
  
  res.render('donate2',{name:req.session.name,logtype:req.session.logtype})
})
router.post('/donate3',auth1,(req,res)=>{
if(Array.isArray(req.body.name)){
  var len=req.body.name.length;
}
else{
  var len=1;
}
if(len==1){
  var item = new donateitem({
      
    name:req.body.name,
    qty:req.body.qty,
    date:req.body.date,
    city:req.body.city,
    time1:req.body.time1,
    time2:req.body.time2,
    demail:req.session.email,
    status:0,
    eemail:''
    
   });
   item.save();
}
else{
for(var i=0;i<=len-1;i++){
  var item = new donateitem({
      
    name:req.body.name[i],
    qty:req.body.qty[i],
    date:req.body.date[i],
    city:req.body.city[i],
    time1:req.body.time1[i],
    time2:req.body.time2[i],
    demail:req.session.email,
    status:0,
    eemail:''
    
   });
   item.save();
}
}
res.render('donate2',{name:req.session.name,alert:'1',logtype:req.session.logtype})
})

//donate end
//exchange start
router.get('/exchange',(req,res)=>{
  if(req.session.logtype=='2'){
    res.redirect('/ngo-exchange')
  }
  else if(req.session.logtype=="1")
  {
    donater.findOne({email:{$eq:req.session.email}},function(err,data)
    {
      if(data){
    res.render('exchange1',{name:req.session.name,data,logtype:req.session.logtype})
      }
    })
  }
  else{
    res.render('login',{alert2:"1",name:req.session.name})
  }
  
  })
  router.post('/exchange2',auth1,(req,res)=>{
    donaterdetails.findOne({email:{$eq:req.session.email}},function(err,data)
    {
      if(data){
        
        data.phone=req.body.phone;
        data.lon=req.body.lon;
        data.lat=req.body.lat;
        data.add1=req.body.address1;
        data.add2=req.body.address2;
        data.landmark=req.body.landmark;
        data.pincode=req.body.pincode;
        data.city=req.body.city;
        data.save();
      }
      else{
        var newdonater = new donaterdetails({            
      email:req.body.email,
      phone:req.body.phone,
      lon: req.body.lon,
      lat: req.body.lat,
      add1: req.body.address1,
      add2: req.body.address2,
      landmark: req.body.landmark,
      pincode:req.body.pincode,
      city: req.body.city
                     });
     newdonater.save();
      }
    })
    
    res.render('exchange2',{name:req.session.name,logtype:req.session.logtype})
  })
  router.post('/exchange3',auth1,(req,res)=>{
    if(Array.isArray(req.body.name)){
      var len=req.body.name.length;
    }
    else{
      var len=1;
    }
    if(len==1){
      var item = new exchangeitem({
          
        name:req.body.name,
        qty:req.body.qty,
        price:req.body.price,
        date:req.body.date,
        city:req.body.city,
        time1:req.body.time1,
        time2:req.body.time2,
        demail:req.session.email,
        status:0,
        eemail:''
        
       });
       item.save();
    }
    else{
    for(var i=0;i<=len-1;i++){
      var item = new exchangeitem({
          
        name:req.body.name[i],
        qty:req.body.qty[i],
        price:req.body.price[i],
        date:req.body.date[i],
        city:req.body.city[i],
        time1:req.body.time1[i],
        time2:req.body.time2[i],
        demail:req.session.email,
        status:0,
        eemail:''
        
       });
       item.save();
    }
  }

  res.render('exchange2',{name:req.session.name,alert:'1',logtype:req.session.logtype})
  })

//exchange end

//volunteer start
router.get('/volunteer',(req,res)=>{
  donater.findOne({email:{$eq:req.session.email}},function(err,data)
  {
    if(data){
  res.render('bevolunteer',{name:req.session.name,data,logtype:req.session.logtype})
    }
    else{
      res.render('bevolunteer',{name:req.session.name,logtype:req.session.logtype})
    }
  })
})
router.post('/addvolunteer',(req,res)=>{
  volunteer.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
      res.render('bevolunteer',{alert:'2',name:req.session.name,logtype:req.session.logtype})
    }
    else{
      var volunt = new volunteer({
      
        name:req.body.name,
        email:req.body.email,
        aadhar:req.body.aadhar,
        phone:req.body.phone,
        add1:req.body.address1,
        add2:req.body.address2,
        landmark:req.body.landmark,
        pincode:req.body.pincode,
       city:req.body.city,
        
       });
       volunt.save();
        res.render('bevolunteer',{alert:'1',name:req.session.name,logtype:req.session.logtype})
    }
  })

})

//volunteer end
// <----------------------     Donater  ------      start       --------------->
//login start
router.get('/login',(req,res)=>{
  res.render('login',{name:req.session.name})
})
router.post('/checklogin',(req,res)=>{
  donater.findOne({ $and:[ {'email':req.body.email}, {'status':1} ]},function(err,data)
{
  if(data){
  bcrypt.compare(req.body.password,data.password, function(err, doesMatch){
    if (doesMatch){
      req.session.logtype="1";
      req.session.name=data.name;
      req.session.email=data.email;
      res.redirect('/')
    }
    else{
      res.render('login',{name:req.session.name,alert:"1"})
    }
  })
}
else{
  res.render('login',{name:req.session.name,alert:'2'})
}
})
})

//login end
//forgot password start
router.get('/forgot',(req,res)=>{
  res.render('forgot',{name:req.session.name})
})
router.post('/forgot2',(req,res)=>{
  donater.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
      otp=Math.floor(Math.random() * 999999) + 100000;
      req.session.otp=otp;
      req.session.gmail=req.body.email;
      var mailOptions = {
        from: 'abhrabag999@gmail.com',
        to: req.body.email,
        subject: "You Account is created in 'Food For All'",
        text:'Otp :'+otp
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })  
      res.render('forgot2',{name:req.session.name,email:req.body.email})
    }
    else{
      res.render('forgot',{name:req.session.name,alert:'0'})
    }
    
  })
  
})
router.post('/forgot3',(req,res)=>{
  if(req.body.otp==req.session.otp){
    res.render('forgot3',{name:req.session.name})
  }
  else{
    res.render('forgot2',{name:req.session.name,email:req.session.gmail,alert:'0'})
  }
 
})
router.post('/forgot4',(req,res)=>{
  if(req.body.password==req.body.confirm){
    donater.findOne({email:{$eq:req.session.gmail}},function(err,data)
    {
      if(data){
          data.password=bcrypt.hashSync(req.body.password,10);
          data.save();
      }
    })
  
    res.render('login',{name:req.session.name,alert2:'0'})
  }
  else{
    res.render('forgot3',{name:req.session.name,alert:'0'})
  }
 
})
//forgot password end
//change password start
router.get('/changepassword',(req,res)=>{
  res.render('change',{name:req.session.name,logtype:req.session.logtype})
})
router.post('/change2',(req,res)=>{
 
  donater.findOne({email:{$eq:req.session.email}},function(err,data)
  {
    if(data){
    bcrypt.compare(req.body.previous,data.password, function(err, doesMatch){
      if (doesMatch){
        if(req.body.password==req.body.confirm) 
        {
          var hash= bcrypt.hashSync(req.body.password,10);
          data.password=hash;
          data.save();
          cause.find({upcoming:{$eq:"1"}},function(err,data)
          {
              event.find({upcoming:{$eq:"1"}},function(err,data2)
                 {
              res.render('main',{data,data2,name:req.session.name,logtype:req.session.logtype,alert:'5'})
                 }).limit(2) 
            
          }).limit(3) 
        }
        else{
          res.render('change',{name:req.session.name,alert:1,logtype:req.session.logtype})
        }
      }
      else{
        res.render('change',{name:req.session.name,alert:2,logtype:req.session.logtype})
      }
    })
  }
}) 
})

//change password end

//logout start
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

//logout end

//register start
router.get('/register',(req,res)=>{
  res.render('register',{name:req.session.name})
})
router.post('/adddonater',(req,res)=>{
  donater.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
      res.render('register',{name:req.session.name,alert:'4'})
    }
    else{
      emailExistence.check(req.body.email, function(err,ress){
       {
        console.log(ress)
          if(validator.isValidNumber(req.body.aadhar)==false){
             res.render('register',{name:req.session.name,alert:'2'})
          }
          else{
           if(req.body.password==req.body.confirm)
           {
            var hash= bcrypt.hashSync(req.body.password,10);
            var donate = new donater({
      
              name:req.body.name,
              email:req.body.email,
              aadhar:req.body.aadhar,
              password:hash,
              status:0
              
             });
             donate.save(function(err,data){
             link='http://18.220.120.44:3000/verify11/'+data._id
             var mailOptions = {
               from: 'abhrabag999@gmail.com',
               to: req.body.email,
               subject: "FOOD FOR ALL signup",
               html:'<h1>You Account is created in Food For All</h1><br><br><center><a href='+link+'><button  style="background-color:blue">Confirm Email</button></a></center>'
             };
             
             transporter.sendMail(mailOptions, function(err, info){
   
                 if (err) {
                   console.log(err)
                  
                 } 
             
             })
            })  
            res.render('login',{name:req.session.name,alerts:"1"})
           }
           else{
            res.render('register',{name:req.session.name,alert:'3'})
           }
          }
        }
      })
    }
  })
})

//register end
//previous start
router.get('/previous',auth1,(req,res)=>{
  donateitem.find({demail:{$eq:req.session.email}},function(err,data){
    exchangeitem.find({demail:{$eq:req.session.email}},function(err,data2){
res.render('previous.ejs',{name:req.session.name,data,logtype:req.session.logtype,data2})
  })
  })

 
})


//previous end
//<----------------------     Donater  ------      end       --------------->

//<----------------------     Ngo  ------      start       --------------->

//register start
router.get('/ngo-register',(req,res)=>{
  res.render('register-ngo',{name:req.session.name})
})
router.post('/ngo-adddonater',(req,res)=>{
  ngo.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
      res.render('register-ngo',{name:req.session.name,alert:'4'})
    }
    else{
      emailExistence.check(req.body.email, function(err,ress){
     {
       console.log(ress)
        
           if(req.body.password==req.body.confirm)
           {
            var hash= bcrypt.hashSync(req.body.password,10);
            var newngo = new ngo({
              id:req.body.id,
              name:req.body.name,
              email:req.body.email,
            status:0,
              password:hash
              
             });
             newngo.save(function(err,data){
              link='http://18.220.120.44:3000/verify12/'+data._id
              var mailOptions = {
                from: 'abhrabag999@gmail.com',
                to: req.body.email,
                subject: "FOOD FOR ALL signup",
                html:'<h1>You Account is created in Food For All</h1><br><br><center><a href='+link+'><button  style="background-color:blue">Confirm Email</button></a></center>'
              };
              
              transporter.sendMail(mailOptions, function(err, info){
    
                  if (err) {
                    console.log(err)
                   
                  } 
              
              })
             }) 
            res.render('login-ngo',{name:req.session.name,alerts:"1"})
           }
           else{
            res.render('register-ngo',{name:req.session.name,alert:'3'})
           }
          
        }
      })
    }
  })
})
router.get('/verify11/:id',(req,res)=>{
  
  var id=req.url.split("/").pop()
  donater.findOne({_id:{$eq:id}},function(err,data){
    if(data){
   data.status=1
   data.save();
   res.send('Email Confirmed')
    }
    else{
      res.send('Email Not Found')
    }
  })
})
router.get('/verify12/:id',(req,res)=>{
  
  var id=req.url.split("/").pop()
  ngo.findOne({_id:{$eq:id}},function(err,data){
    if(data){
   data.status=1
   data.save();
   res.send('Email Confirmed')
    }
    else{
      res.send('Email Not Found')
    }
  })
})
//register end
//login start
router.get('/ngo-login',(req,res)=>{
  res.render('login-ngo',{name:req.session.name})
})
router.post('/ngo-checklogin',(req,res)=>{
  ngo.findOne({ $and:[ {'email':req.body.email}, {'status':1} ]},function(err,data)
{
  if(data){
  bcrypt.compare(req.body.password,data.password, function(err, doesMatch){
    if (doesMatch){
      req.session.logtype="2";
      req.session.name=data.name;
      req.session.email=data.email;
      res.redirect('/')
    }
    else{
      res.render('login-ngo',{name:req.session.name,alert:"1"})
    }
  })
}
else{
  res.render('login-ngo',{name:req.session.name,alert:'2'})
}
})
})

//login end

//forgot password start
router.get('/ngo-forgot',(req,res)=>{
  res.render('forgot-ngo',{name:req.session.name})
})
router.post('/ngo-forgot2',(req,res)=>{
  ngo.findOne({email:{$eq:req.body.email}},function(err,data)
  {
    if(data){
      otp=Math.floor(Math.random() * 999999) + 100000;
      req.session.otp=otp;
      req.session.gmail=req.body.email;
      var mailOptions = {
        from: 'abhrabag999@gmail.com',
        to: req.body.email,
        subject: "You Account is created in 'Food For All'",
        text:'Otp :'+otp
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })  
      res.render('forgot2-ngo',{name:req.session.name,email:req.body.email})
    }
    else{
      res.render('forgot-ngo',{name:req.session.name,alert:'0'})
    }
    
  })
  
})
router.post('/ngo-forgot3',(req,res)=>{
  if(req.body.otp==req.session.otp){
    res.render('forgot3-ngo',{name:req.session.name})
  }
  else{
    res.render('forgot2-ngo',{name:req.session.name,email:req.session.gmail,alert:'0'})
  }
 
})
router.post('/ngo-forgot4',(req,res)=>{
  if(req.body.password==req.body.confirm){
    ngo.findOne({email:{$eq:req.session.gmail}},function(err,data)
    {
      if(data){
          data.password=bcrypt.hashSync(req.body.password,10);
          data.save();
      }
    })
  
    res.render('login-ngo',{name:req.session.name,alert2:'0'})
  }
  else{
    res.render('forgot3-ngo',{name:req.session.name,alert:'0'})
  }
 
})
//forgot password end
//change password start
router.get('/ngo-changepassword',(req,res)=>{
  res.render('change-ngo',{name:req.session.name,logtype:req.session.logtype})
})
router.post('/ngo-change2',(req,res)=>{
 
  ngo.findOne({email:{$eq:req.session.email}},function(err,data)
  {
    if(data){
    bcrypt.compare(req.body.previous,data.password, function(err, doesMatch){
      if (doesMatch){
        if(req.body.password==req.body.confirm) 
        {
          var hash= bcrypt.hashSync(req.body.password,10);
          data.password=hash;
          data.save();
          cause.find({upcoming:{$eq:"1"}},function(err,data)
          {
              event.find({upcoming:{$eq:"1"}},function(err,data2)
                 {
              res.render('main',{data,data2,name:req.session.name,logtype:req.session.logtype,alert:'5'})
                 }).limit(2) 
            
          }).limit(3) 
        }
        else{
          res.render('change-ngo',{name:req.session.name,alert:1,logtype:req.session.logtype})
        }
      }
      else{
        res.render('change-ngo',{name:req.session.name,alert:2,logtype:req.session.logtype})
      }
    })
  }
}) 
})

//change password end
//donate start 
router.get('/ngo-donate',auth2,(req,res)=>{
  donateitem.find({status:{$eq:0}},function(err,data)
  {
res.render('avdonation.ejs',{name:req.session.name,data,logtype:req.session.logtype})
  })
})
router.get('/accept/:id',auth2,(req,res)=>{
  
  var id=req.url.split("/").pop()
  donateitem.findOne({_id:{$eq:id}},function(err,data){
  
   data.status="1";
   data.eemail=req.session.email;
   data.save(); 
   donaterdetails.findOne({email:{$eq:data.demail}},function(err,data2){
   var mailOptions = {
    from: 'abhrabag999@gmail.com',
    to: data.eemail,
    subject: 'Succefully Accepted',
    text:data.demail + data.name + 'https://www.google.com/maps/dir/?api=1&destination='+data2.lat+','+data2.lon ,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })  
})
  })
  
res.redirect('/ngo-donate')

})
router.get('/map/:id',auth2,(req,res)=>{
  
  var id=req.url.split("/").pop()
  donateitem.findOne({_id:{$eq:id}},function(err,data){
  donaterdetails.findOne({email:{$eq:data.demail}},function(err,data2){
   res.redirect('https://www.google.com/maps/dir/?api=1&destination='+data2.lat+','+data2.lon)
   //30.7333,76.7794
  })
  })


})

//donate end
//exchange start 
router.get('/ngo-exchange',auth2,(req,res)=>{
  exchangeitem.find({status:{$eq:0}},function(err,data)
  {
res.render('avexchange.ejs',{name:req.session.name,data,logtype:req.session.logtype})
  })
})
router.get('/accept2/:id',auth2,(req,res)=>{
  
  var id=req.url.split("/").pop()
  exchangeitem.findOne({_id:{$eq:id}},function(err,data){
  
   data.status="1";
   data.eemail=req.session.email;
   data.save(); 
   donaterdetails.findOne({email:{$eq:data.demail}},function(err,data2){
   var mailOptions = {
    from: 'abhrabag999@gmail.com',
    to: data.eemail,
    subject: 'Succefully Accepted',
    text:data.demail + data.name + 'https://www.google.com/maps/dir/?api=1&destination='+data2.lat+','+data2.lon ,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })  
})
  })
  
res.redirect('/ngo-exchange')

})
router.get('/map2/:id',auth2,(req,res)=>{
  
  var id=req.url.split("/").pop()
  exchangeitem.findOne({_id:{$eq:id}},function(err,data){console.log(data)
  donaterdetails.findOne({email:{$eq:data.demail}},function(err,data2){
    console.log(data2)
   res.redirect('https://www.google.com/maps/dir/?api=1&destination='+data2.lat+','+data2.lon)
   //30.7333,76.7794
  })
  })


})

//exchange end
//previous start
router.get('/ngo-previous',auth2,(req,res)=>{
  donateitem.find({eemail:{$eq:req.session.email}},function(err,data){
    exchangeitem.find({eemail:{$eq:req.session.email}},function(err,data2){
res.render('previous-ngo.ejs',{name:req.session.name,data,logtype:req.session.logtype,data2})
  })
  })
 
})
router.get('/ngo-previous2',auth2,(req,res)=>{
  donateitem.find({eemail:{$eq:req.session.email}},function(err,data){
    exchangeitem.find({eemail:{$eq:req.session.email}},function(err,data2){
res.render('previous-ngo.ejs',{name:req.session.name,data,logtype:req.session.logtype,data2,alerts:'1'})
  })
  })
 
})

//previous end
//accept delivery start
router.get('/delivery/:id',auth2,(req,res)=>{
  
  var id=req.url.split("/").pop()
  donateitem.findOne({_id:{$eq:id}},function(err,data){
  data.status=2
  data.save();
  
  })
res.redirect('/ngo-previous2')

})
router.get('/delivery2/:id',auth2,(req,res)=>{
  var id=req.url.split("/").pop()
  exchangeitem.findOne({_id:{$eq:id}},function(err,data){
    data.status=2
    data.save();
    })
    res.redirect('/ngo-previous2')

})

//accept delivery end
//<----------------------     Ngo  ------      end       --------------->
module.exports = router
