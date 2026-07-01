import mongoose from "mongoose";

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta la variable de entorno MONGODB_URI");

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "AulaVirtualDB",
  });

  console.log(`Conectado a MongoDB Atlas (base: ${mongoose.connection.db?.databaseName})`);
  return mongoose;
}

export async function closeDB(): Promise<void> {
  await mongoose.disconnect();
}
