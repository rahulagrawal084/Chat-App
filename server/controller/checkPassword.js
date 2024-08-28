const userModel = require("../models/userModel")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        const user = await userModel.findById(userId)

        const verifyPassword = await bcryptjs.compare(password, user.password)
        //compare function will compare entered password by user and saved hashed password in db

        if(!verifyPassword){
            return res.status(400).json({
                message : "Please check password",
                error : true
            })
        }

        //starts jwt concept from here
        const tokenData = {
            id : user._id,
            email : user.email
        }

        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY, { expiresIn : "45d"})
        //converted id and email in token

        const cookieOptions = {
            http : true,
            secure : true
        }

        return res.cookie("token",token,cookieOptions).status(200).json({
            message : "Login success",
            token : token, //instead of sending user data (data : user), we will send token
            //with the help of token, we can extract user information
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword;