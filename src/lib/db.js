import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "news-app";

let cached = globalThis.__mongooseConnection;

if (!cached) {
  cached = globalThis.__mongooseConnection = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from your environment");
  }

  if (MONGODB_URI.includes("<db_password>")) {
    throw new Error("Replace <db_password> in MONGODB_URI before connecting");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

export { mongoose };
