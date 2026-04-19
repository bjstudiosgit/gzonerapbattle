import { createClient } from '@supabase/supabase-js';

// Force Node runtime (important for Supabase)
export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  // Create Supabase client ONCE
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // =========================
    // 🟢 GET → Fetch messages
    // =========================
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("GET error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    // =========================
    // 🔵 POST → Insert message
    // =========================
    if (req.method === 'POST') {
      // Safe body handling (fixes undefined issue)
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body;

      if (!body) {
        return res.status(400).json({ error: 'No body received' });
      }

      const { user, message } = body;

      // Basic validation
      if (!user || !message) {
        return res.status(400).json({
          error: 'User and message are required'
        });
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            user_name: user,
            text: message
          }
        ])
        .select(); // 👈 returns inserted row

      if (error) {
        console.error("POST error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    // =========================
    // ❌ Method not allowed
    // =========================
    return res.status(405).json({
      error: 'Method not allowed'
    });

  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({
      error: err.message || "Something went wrong"
    });
  }
}