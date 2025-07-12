const express = require("express");
const userRouter = require("./routes/user.js");

const { connectMongoDb } = require("./connection.js");

const { logReqRes } = require("./middleware");

const app = express();
const PORT = 3000;

//Connection
connectMongoDb("mongodb://127.0.0.1:27017/rest-api-1").then(() => {
  console.log("mongoDb connected!");
});

// Middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(logReqRes("log.txt"));

//Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
