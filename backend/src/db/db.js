//logic for connecting database to server (which is used in server.js)

const mongoose = require('mongoose');



function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:",err);
    })
}

module.exports = connectDB;