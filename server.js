const express = require('express');
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//Registering User
app.post("/users/register",(req,res) => {
    let {name, email, password, password2} = req.body

    let errors = []

    if(!name){
        errors.push("name is required.")
    }
    
    if(!email) {
        errors.push("email is required.")
    }
    
    if(!password) {
        errors.push("password is required.")
    } 
    
    if(!password2) {
        errors.push("password2 is required.")
    }

    if(password.length < 6){
        errors.push("password must be greater than 6 character.")
    }

    if(!check(email).isEmail()) {
        errors.push("email is invalid.")
    }

    if(password2 != password){
        errors.push("password doesn't match.")
    }


    if(errors.length > 0) {

         //Sending error response
        res.status(400).json({
            code : 400,
            message : errors[0]
        })

    } else {
        
         //Creating user and sending success message
         res.status(200).json({
             code : 200,
             message : "User created successfully."
         })
    }


});







app.listen(PORT,()=> {
    console.log(`Server is up and running on port ${PORT}`);
})