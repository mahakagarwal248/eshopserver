const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
//const PORT = process.env.PORT || 5000;
require("dotenv").config();
const port = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(morgan("dev"));
connectDB();

//define routes and api
app.use(express.json({extended: false}));

app.use("/api/users", require("./routes/userAPI"));
app.use("/api/products", require("./routes/productsAPI"));
app.use("/api/auth", require("./routes/authAPI"));
app.use("/api/profile", require("./routes/ProfileAPI"));
app.use("/api/cart", require("./routes/cartAPI"));
app.use("/api/payment", require("./routes/PaymentAPI"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("Client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "Client", "build", "index.html"));
    });
  }

app.listen(port, ()=>{
    console.log(`Server is listening `)
});