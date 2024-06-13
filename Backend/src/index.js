import dotenv from "dotenv"; // Importing dotenv to use environment variables
import connectDB from "./db/db.js"; 
import app from "./app.js";

// Configuring dotenv to use environment variables
dotenv.config({
    path: "./env"
})

// Connecting to the database
connectDB()
.then(()=>{
    const port = process.env.PORT || 8000
    app.listen(port,()=>{
        console.log(`Server is runing at port : ${port}`)
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed !!!",error)
})