const express=require('express')
const connectDB=require('./config/db')
const app=express()
const path = require("path");
require("dotenv").config();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const jwt = require("jsonwebtoken");
connectDB()




app.listen(3000,()=>{
  console.log('Server is running on port 3000')
})