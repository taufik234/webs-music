import express from "express";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
