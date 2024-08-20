import mongoose from "mongoose";

connectToMongoDB = async (url) => {
    return mongoose.connect(url);
}

export default connectToMongoDB;

// Mongo DB - Password - wixI3ENIgtHHc4NS

// mongodb+srv://srivatsansrinivasan03:wixI3ENIgtHHc4NS@url-shortener.swmwy.mongodb.net/?retryWrites=true&w=majority&appName=url-shortener