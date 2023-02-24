const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors")
const User = require("./models/User");

dotenv.config();
const jwtSecret = process.env.MY_SECRETKEY;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }));
  

app.get("/test", (req, res) => {
    res.json("test ok")
});

app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username,
            password: hashedPassword
        });
        jwt.sign({userId: createdUser._id, username}, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
              id: createdUser._id,
            });
        })
    } catch (error) {
        if (error) throw error;
        res.status(500).json('error');
    }


})

const PORT = 4000
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    })
}).catch(err=> {
    console.log('Error: ', err)
});
