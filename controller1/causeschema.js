var mongoose=require('mongoose');
mongoose.pluralize(null);
mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const causeSchema=new mongoose.Schema({
 name:String,
 details:String,
 collectmoney:Number,
 photo:String,
 upcoming:Number
  })
  module.exports=mongoose.model('cause',causeSchema);