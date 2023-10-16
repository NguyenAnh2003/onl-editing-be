import mongoose from 'mongoose';

const connection = async () => {
  const URL = 'mongodb://127.0.0.1:27017/onlediting';
  try {
    await mongoose.connect(URL)
    console.log("Connect success");    
  } catch (error) {
    console.log(error);
  }
};

export default connection;
