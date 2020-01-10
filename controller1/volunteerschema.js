var mongoose=require('mongoose');
mongoose.pluralize(null);
 mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const volunteerSchema=new mongoose.Schema({

 email:String,
 name:String,
 aadhar:Number,
 phone:Number,
 add1:String,
 add2:String,
 landmark:String,
 pincode:String,
 city:String,

 
  })
  module.exports=mongoose.model('volunteer',volunteerSchema);