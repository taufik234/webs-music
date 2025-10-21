import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Supabase Auth API is running ...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server running on port ${PORT}"));
