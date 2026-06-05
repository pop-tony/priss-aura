import mongoose from "mongoose";

const connectDB = async ()=>{

    mongoose.connection.on('connected', ()=> console.log("Database Connected"));

    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/megaProject1`);
    }catch(error){
        console.log("Not connected to Database")
    }
}

export default connectDB;