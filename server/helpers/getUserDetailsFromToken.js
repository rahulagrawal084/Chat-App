//this file we created to avoid same code in multiple files because we will extract user information 
// from token in multiple pages
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const getUserDetailsFromToken = async (token) => {
    if(!token){
        return {
            message : "session out",
            logout : true
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    //if it's okay then we will get the id and email of particular user because in checkPassword.js, we converted id and email into token

    const user = await userModel.findById(decode.id).select("-password")
    return user;
}

module.exports = getUserDetailsFromToken;

//now everytime whenever we pass token in this function, we will get the user details