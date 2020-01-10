var mongoose=require('mongoose');
mongoose.pluralize(null);
mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const contactSchema=new mongoose.Schema({
 name:String,
 email:String,
 subject:String,
 message:String,
 
  })
  module.exports=mongoose.model('contact',contactSchema);