const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("MongoDb Connection Seccessfull");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
