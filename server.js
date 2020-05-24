const express = require('express');
const bcrypt = require('bcrypt');
const {pool } = require("./dbConfig")
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//Registering User
app.post("/users/register",async (req,res) => {
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

    if(password && password.length < 6){
        errors.push("password must be greater than 6 character.")
    }


    if(!isValidEmail(email)) {
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
        

        //Check if already exists or not
        pool.query(
            `SELECT * FROM users WHERE email  = $1 `, [email],async (err,queryResults) => {
                   if(err) {
                       throw err;
                   }

                   if(queryResults.rowCount>0){
                    res.status(400).json({
                        code : 400,
                        message : "This email is already registred."
                    })
                   } else {
                       //Creating user and sending success message
                        let hasedPassword = await bcrypt.hash(password,10)
                       pool.query(`INSERT INTO users (name,email,password) VALUES ($1 ,$2 ,$3)`, [name,email,hasedPassword], (err,queryResults) => {
                                if(err){
                                    res.status(400).json({
                                        code : 400,
                                        message : err.message
                                    })
                                } else {
                                    res.status(200).json({
                                        code : 200,
                                        message : "User Created successfully",
                                        data : queryResults[0]
                                    })
                                }
                            }
                       );
                   }
            }
        )    
    }

});



function isValidEmail( value ) {
	return /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/.test( value );
}



app.listen(PORT,()=> {
    console.log(`Server is up and running on port ${PORT}`);
})