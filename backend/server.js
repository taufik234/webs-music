import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

// Inisialisasi Supabase Client (backend)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend connected to Supabase 🚀" });
});

// Ambil data lagu
app.get("/songs", async (req, res) => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Tambah lagu baru
app.post("/songs", async (req, res) => {
  const { title, artist, genre, album, year, audio_url } = req.body;
  const { data, error } = await supabase.from("songs").insert([{ title, artist, genre, album, year, audio_url }]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
