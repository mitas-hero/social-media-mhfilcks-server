import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js";
import connectDB from "./db/db.js";

const port = process.env.PORT || 5000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log("MhFlicks app is listening on port:", port);
        })
        app.get("/", async (req, res) => {
            res.send("Hello World! deploy amar matha kharap kore dilo!!!😭😭😭")
        })
    })
    .catch(err => {
        console.error("Mongodb connection error:", err);
    })