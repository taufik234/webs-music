import { supabase } from "../supabaseClient.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    option: {
      data: { username },
    },
  });
  if (error) return res.satus(400).json({ error: error.message });
  res.json({ message: "Account created successfully!" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Login successful!", data });
};
