import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.log(error);
        process.exit(1);
    }
}

export default connectToMongoDB;

// Mongo DB - Password - wixI3ENIgtHHc4NS

// mongodb+srv://srivatsansrinivasan03:wixI3ENIgtHHc4NS@url-shortener.swmwy.mongodb.net/?retryWrites=true&w=majority&appName=url-shortener