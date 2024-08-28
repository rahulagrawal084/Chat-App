const userModel = require("../models/userModel");

async function checkEmail(req, res){
    try {
        const { email } = req.body;

        const checkEmail = await userModel.findOne({ email }).select("-password")

        //check for email in database while login
        if(!checkEmail){
            return res.status(400).json({
                message : "User not exists",
                error : true
            })
        }

        return res.status(200).json({
            message : "email verify",
            success : true,
            data : checkEmail //print user data at console except password
        })

    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkEmail;