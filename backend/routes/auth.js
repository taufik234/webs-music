import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ message: "Email, password, and username are required." });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
    });
    if (error) throw error;
    res.status({ success: true, user: data.user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get("check-session", async (req, res) => {
  try {
    const token = req.header.authorization?.replace("Bearer ", "");
    if (!token) res.status(401).json({ error: "no token provided" });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "invalid or ecpired token" });
    }
    return res.json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
export default router;
