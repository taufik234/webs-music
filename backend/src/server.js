import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {db} from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Backend is running"});
});

app.get("/api/items", async (req, res) => {
    const rows = await db.all("SELECT * FROM items");
    res.json(rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});