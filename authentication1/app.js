const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const jwt = require("jsonwebtoken");
connectDB();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { username, email, password, age } = req.body;
  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).send("Internal Server Error");
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server Error");
      }

      try {
        const newUser = new userModel({ username, email, password: hash, age });
        await newUser.save();
        res.send("User registered successfully");
        console.log(newUser);
        jwt.sign(
          { email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              console.error("Error signing token:", err);
              return res.status(500).send("Internal Server Error");
            }
            res.cookie("token", token);
            console.log("JWT Token:", token);
          }
        );
      } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Internal Server Error");
      }
    });
  });

  // try {
  //   const newUser = new userModel({ username, email, password, age });
  //   await newUser.save();
  //   res.send('User registered successfully');
  //   console.log(newUser)
  // } catch (error) {
  //   console.error('Error saving user:', error);
  //   res.status(500).send('Internal Server Error');
  // }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });

  if (!user) {
    console.log("something is went wrong");
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result) {
      jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Error signing token:", err);
            return res.status(500).send("Internal Server Error");
          }
          res.cookie("token", token);
          console.log("JWT Token:", token);
          res.redirect("/");
        }
      );
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`
  );
});
