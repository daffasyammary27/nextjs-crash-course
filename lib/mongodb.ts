import mongoose from 'mongoose';


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the global namespace to include our mongoose cache
declare global {
  var mongooseCache: MongooseCache;
}

// Initialize the cache from the global object or create a new one
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establishes a database connection to MongoDB using Mongoose.
 * Reuses the existing connection if one is already established.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose instance.
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  // Return the cached connection if it is already established
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGO_URI as string;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGO_URI environment variable inside .env.local'
    );
  }

  // Create a new connection promise if one is not already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering for faster failure on un-connected models
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and store the established connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on failure so subsequent calls can try connecting again
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
