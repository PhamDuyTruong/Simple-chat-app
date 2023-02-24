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

});

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findOne({username});
    if(foundUser){
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if(passOk){
            jwt.sign({userId:foundUser._id,username}, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, {sameSite:'none', secure:true}).json({
                  id: foundUser._id,
                });
              });
        }
    }
});

app.post('/logout', (req,res) => {
    res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
  });

app.get('/profile', (req,res) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        res.json(userData);
      });
    } else {
      res.status(401).json('no token');
    }
});

const PORT = 4000
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    })
}).catch(err=> {
    console.log('Error: ', err)
});
