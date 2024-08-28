const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        const connection = mongoose.connection
        connection.on("connected", () => {
            console.log("DB Connected")
        })

        connection.on("error", (error) => {
            console.log("Something went wrong in DB", error)
        })
    }catch (error){
        console.log("Something went wrong ", error)
    }
}

module.exports = connectDB;