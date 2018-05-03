const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoDbURI;
const users = require("./routes/api/user");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

mongoose
  .connect(db)
  .then(() => console.log("successfully connected to DB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello !"));

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running on port ${port} !`));
