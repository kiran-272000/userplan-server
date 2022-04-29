const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://adim:admin12345@cluster0.1nvzp.mongodb.net/subscribers?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connected Sucessfully");
  });
