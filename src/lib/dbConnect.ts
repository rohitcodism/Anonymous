import mongoose from "mongoose";

type ConnectionObject =  {
    isConnected?: number,
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if (connection.isConnected) {
        console.log("Anonymous database connected successfully!!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{}); // TODO: Just study about the options object in mongoose.connect() function.

        console.log("DB Connection : ",db);

        connection.isConnected = db.connections[0].readyState

        console.log("Anonymous database connected successfully!!")
    } catch (error) {

        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;