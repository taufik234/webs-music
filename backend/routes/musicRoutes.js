import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET all songs
router.get("/songs", async (req, res) => {
  try {
    const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, songs: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
