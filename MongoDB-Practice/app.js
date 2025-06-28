const express = require("express");
const app = express();
const userModel = require("./usermodel");

app.get("/", (req, res) => {
  res.send("hey");
});

app.get("/create", async (req, res) => {
  let createdUser = await userModel.create({
    name: "raza",
    username: "raza@gmail.com",
    username: "razasid",
  });

  res.send(createdUser);
});

app.get("/read", async (req, res) => {
  let users = await userModel.find({ username: "razasid" });

  res.send(users);
});

app.get("/update", async (req, res) => {
  let updatedUser = await userModel.findOneAndUpdate(
    { name: "raza" },
    { name: "raza siddique" },
    { new: false }
  );

  res.send(updatedUser);
});

app.get("/delete", async (req, res) => {
  let users = await userModel.findOneAndDelete({ username: "razasid" });

  res.send(users);
});

app.listen(3000);
