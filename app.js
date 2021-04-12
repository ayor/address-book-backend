const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

const authRoute = require('./route/auth-route');
const contactRoute = require('./route/contact-route');
const ussdRoute = require('./route/ussd-route');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next )=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type", "Authorization");

    next();
});

app.use('/auth', authRoute);
app.use('/ussd', ussdRoute);
app.use('/contact', contactRoute)

app.use((error, req, res, next)=>{
    const err = {
        ...error,
        
    };
    if(!error.status){
        err.status = 500;
        err.message = "An error occured, kindly contact the administrator";
    }
    

    res.status(err.status).json({
       ...err
    })
})

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('connected');
})
