const mongoose= require('mongoose');
const mongoURI="mongodb://localhost:27017/inoteBook";

const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(console.log('connected to mongo'));
}
module.exports=connectToMongo; 