const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetail(req, res){
    try {
        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)
        return res.status(200).json({
        message : "user details",
        data : user //with the help of token function with token value as argument, we are extracting user details
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = userDetail;