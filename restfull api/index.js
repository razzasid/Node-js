const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const { log } = require("console");
const app = express();
const PORT = 3000;

// Middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>`;
  return res.send(html);
});

//REST API
app
  .route("/api/users")
  .get((req, res) => {
    //Headers
    //Always add X to custom Headers
    res.setHeader("X-myName", "Raza Siddique"); //custom Header
    console.log(req.headers);
    res.json(users);
  })
  .post((req, res) => {
    const body = req.body;

    if (
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.gender ||
      !body.email ||
      !body.job_title
    ) {
      return res.status(400).json({ msg: "all Fields are required" });
    }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.status(201).json({ status: "success", id: users.length });
    });
  });

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    //update user with id
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    for (let key in req.body) {
      if (user.hasOwnProperty(key)) {
        user[key] = req.body[key];
      }
    }

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to update" });
      }
      return res.json({ status: "success", updatedUser: user });
    });
  })
  .delete((req, res) => {
    //TODO: Delete user with id
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const updatedUsers = users.filter((user) => user.id !== id);
    users.length = 0;
    users.push(...updatedUsers);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to delete" });
      }
      return res.json({ status: "success", deletedUser: user });
    });
  });

app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
