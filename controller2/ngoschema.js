var mongoose=require('mongoose');
mongoose.pluralize(null);
 mongoose.connect('mongodb+srv://bag:Abhraneel@1@scluster-bsshp.mongodb.net/next', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/next', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema=new mongoose.Schema({
    name:String,
    id:String,
  email:String,
  password:String,
  status:Number,

  
 
  })
  module.exports=mongoose.model('ngo',userSchema);