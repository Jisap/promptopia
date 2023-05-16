import mongoose from 'mongoose';

//Bza5XKXuj894N6sV

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const {connection} = await mongoose.connect(process.env.MONGODB_URI, 
      {
        dbName: "share_prompt",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    isConnected = true;

    console.log(`Mongodb is connected to ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
}