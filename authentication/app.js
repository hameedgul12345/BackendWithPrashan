const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
app.use(cookieParser());

//How Set a cookie
// app.get('/',(req,res)=>{
//   res.cookie('userName', 'JohnDoe');
//   res.send('Cookie has been set');
// })
// How to read a cookie
// app.get('/read',(req,res)=>{
//   console.log(req.cookies);
//   res.send('Cookie has been read');
// })

//How to encrypte
// app.get('/',(req,res)=>{
//  bcrypt.genSalt(10, (err, salt) => {
//   console.log('salt:', salt)
//   bcrypt.hash('myPassword', salt, (err, hash) => {
//     if (err) {
//       console.error('Error hashing password:', err);
//       return res.status(500).send('Error hashing password');
//     }
//     console.log('Hashed password:', hash);
//     res.send('Password has been hashed');
//   });

//  });
// })
//and Decrypt

// app.get('/read',(req,res)=>{
//   bcrypt.compare('myPassword', '$2b$10$fJlFcmUri2pm2oCkKv2jXuICqB84hSN4HoQk0DX4NT6TRu3AgKFQ6', (err, result) => {
//     if (err) {
//       console.error('Error comparing password:', err);
//       return res.status(500).send('Error comparing password');
//     }
//     if (result) {
//       console.log('Password matches!');
//       res.send('Password matches!');
//     } else {
//       console.log('Password does not match.');
//       res.send('Password does not match.');
//     }
//   });
// })

app.get("/", (req, res) => {
  const user = { email: "john.doe@example.com" };

  const token = jwt.sign(user, "your_secret_key", { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });
  res.send("Login successful, token set in cookie");
});


app.get("/protected", (req, res) => {
  const token = req.cookies.token;  
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  const actuall=jwt.verify(token, "your_secret_key",)
  console.log(actuall)
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
