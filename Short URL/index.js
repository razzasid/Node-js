const express = require("express");
const path = require("path");
const { connectToMongoDb } = require("./connect");
const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const URL = require("./models/urls");

const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected!")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
