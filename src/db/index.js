import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongodb connected successfully !! URI works fine ${connectionInstance.connection.host} ${DB_NAME}`);
        
    } catch (error) {
        console.log("Mongodb atlas connection failed", error);
        process.exit(1)        
    }
}



export default connectDB