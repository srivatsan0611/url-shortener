import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



connectToMongoDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
}

export default connectToMongoDB;

// Mongo DB - Password - wixI3ENIgtHHc4NS

// mongodb+srv://srivatsansrinivasan03:wixI3ENIgtHHc4NS@url-shortener.swmwy.mongodb.net/?retryWrites=true&w=majority&appName=url-shortener