import mongoose from 'mongoose';

/* 
  * This is a module that connects to MongoDB using Mongoose.
  * It checks if a connection already exists and reuses it if so.
  * Otherwise, it creates a new connection.
  * The connection string is taken from the environment variable MONGO_DB_URL.
  * If the variable is not set, an error is thrown.
  * this code is useful for serverless functions or applications that need to connect to a database.
  * It prevents multiple connections from being created and helps to manage the connection pool efficiently.
  * The code also extends the global object to include a cached connection, which is used to store the connection and reuse it.
  */


const MONGODB_URI = process.env.MONGO_DB_URL || '';

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}



// Extend global to include mongoose to understand the shpae of the global object
let cached = (global as typeof globalThis & { mongoose: any }).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset the promise in case of failure
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    } else {
      throw new Error('Failed to connect to MongoDB: An unknown error occurred');
    }
  }

  return cached.conn;
}

export default dbConnect;