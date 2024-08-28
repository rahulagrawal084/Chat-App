const express = require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetail = require("../controller/userDetail");
const logout = require("../controller/logout");
const updateUserDetail = require("../controller/updateUserDetail");
const searchUser = require("../controller/searchUser");

const router = express.Router();

//create user API
router.post("/register", registerUser)
//check emsil
router.post("/email", checkEmail)
//check password
router.post("/password", checkPassword)
//login user details
router.get("/details", userDetail)
//logout user
router.get("/logout", logout)
//update user
router.post("/update", updateUserDetail)
//search user
router.post("/searchuser", searchUser)

module.exports = router;
