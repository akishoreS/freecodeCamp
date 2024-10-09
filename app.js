const express = require('express');
const connectDB = require('./config/database');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors =require('cors');
const authRoutes = require('./routes/auth');
const courseRoutes =require('./routes/courses')
dotenv.config()

const app=express();

app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(passport.initialize());

connectDB();

// Routes
require("./config/passport")(passport);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
