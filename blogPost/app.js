const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
require("dotenv").config();
const userModel = require("./models/user");
const multer = require('multer');
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const upload = require("./utill/Profile"); // Importing the multer configuration
connectDB();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/uploads/");
//   },
//   filename: function (req, file, cb) {
//   const fn = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
//   cb(null, fn); // ✅ REQUIRED
// }

// });

// const upload = multer({ storage: storage });




const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (token === "") {
    return res.redirect("/login");
  } else {
    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        return res.redirect("/login");
      }
      req.user = decoded;
      next();
    });
  }
};

app.get("/", async (req, res) => {
  res.render("register");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// app.get("/profile", isLoggedIn, async (req, res) => {
//   let user=await userModel.findOne({ email: req.user.email });
//   console.log(user)
//   user.populate("posts")
//   res.render("profile", { user: user });
// });

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts"); // ✅ Await not needed when chained like this

  res.render("profile", { user });
});


// app.post("/like/:id", isLoggedIn, async (req, res) => {
//   const post = await postModel.findOne({ _id: req.params.id }).populate("user");
//   post.likes.push(req.user.id);
//   await post.save();
//   res.redirect("/profile");
 
// });


// app.get('/test',(req,res)=>{
//   res.render("test", { user: req.user });
// })



// app.post('/test',upload.single('image'),(req,res)=>{

//   console.log(req.file);
//   res.send("File uploaded successfully");
// })

app.post("/like/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Remove like if already liked (toggle off)
      post.likes.pull(userId);
    } else {
      // Add like if not liked yet
      post.likes.push(userId);
    }

    await post.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.post("/post", isLoggedIn, async (req, res) => {
  let user=await userModel.findOne({ email: req.user.email });
  const { content } = req.body;
 const post = await postModel.create({
  user: user._id,
  content: content,
  date: new Date(),
 })


 
  user.posts.push(post._id);

   user.save();
  res.redirect("/profile");
});
 
app.get('/profile/pics', isLoggedIn, (req, res) => {

  res.render("pics",);
})

app.post('/profile/pics', isLoggedIn, upload.single('image'), async (req, res) => {

  const user = await userModel.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Update the profile picture path
  user.profilePic = req.file.filename; // Assuming 'filename' is the field in the uploaded file object
  await user.save();

  res.redirect("/profile");







})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    let token = jwt.sign({ email: user.email, id: user._id }, "secretKey");
    res.cookie("token", token);
   res.status(200).redirect("/profile");
  });
});

app.post("/register", async (req, res) => {
  const { email, password, name, age, posts } = req.body;
  const user = await userModel.findOne({ email: email });
  if (user) {
    return res.status(400).send("User already exists");
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) throw err;
      const newUser = new userModel({
        name,
        email,
        password: hash,
        age,
        posts,
      });
      let token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        "secretKey"
      );
      res.cookie("token", token);

      await newUser.save();

      res.status(201).send("User registered successfully");
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
