import mongoose from 'mongoose'

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true);
    if (!process.env.MONGODB_URL) return console.log('MONGODB_URL is not Found');
    if (isConnected) return console.log('Already connected to mongodb')

    try {
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true;
        console.log("connected to the db");

    } catch (error) {
        console.log(error);

    }
}