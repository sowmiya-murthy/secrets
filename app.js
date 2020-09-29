//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.ENCRYPTKEY,encryptedFields: ['password']});
const userModel = new mongoose.model('user',userSchema);

app.get("/",function(req,res){
    res.render('home');
});

app.get("/login",function(req,res){
    res.render('login');
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
    res.render("home");
});

app.get("/submit",function(req,res){
    res.render("submit");
});

app.post("/register",function(req,res){
    const newUser = new userModel({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
    userModel.findOne(
        {email:req.body.username},
        function(err,userDetail){
            if(err){
                console.log(err);
            }else{
                if(userDetail){
                    if(userDetail.password === req.body.password){
                        res.render("secrets");
                    }
                }else{
                    res.send("The login details doesn't exist. please register.");
                }
            }
        });
});

app.post("/submit",function(req,res){
    const secret = req.body.secret;
});

app.listen(3000,function(){
    console.log("server started successfully");
});