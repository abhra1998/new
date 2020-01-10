var mongoose=require('mongoose');
mongoose.pluralize(null);
 mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const donaterdetailsSchema=new mongoose.Schema({
   
    email: String,
    lon: String,
    lat: String,
    add1: String,
    add2: String,
    landmark: String,
    phone:Number,
    pincode: String,
    city: String
  
  })
  module.exports=mongoose.model('donaterdetails',donaterdetailsSchema);