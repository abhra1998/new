var mongoose=require('mongoose');
mongoose.pluralize(null);
mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const donateitemSchema=new mongoose.Schema({
   
  demail:String,
  eemail:String,
  name:String,
  qty:Number,
  price:Number,
  city:String,
  date:String,
  time1:String,
  time2:String,
  status:Number

 
  
  })
  module.exports=mongoose.model('exchangeitem',donateitemSchema);