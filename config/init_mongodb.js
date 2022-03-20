import mongoose from 'mongoose';

// Connect to MongoDB
const DBConnect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    })
    .then(() => {
      console.log('Mongodb Connected 🤝🔌');
    })
    .catch((err) => {
      console.log(err.message);
    });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected to DB 👌');
  });

  mongoose.connection.on('error', (err) => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Connection is Disconnected 🔴');
  });
};

export default DBConnect;