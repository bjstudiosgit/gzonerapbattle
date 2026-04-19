import { createClient } from '@supabase/supabase-js';

// Force Node runtime (important for Supabase)
export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, message } = req.body;

    // Basic validation (don’t trust users)
    if (!user || !message) {
      return res.status(400).json({ error: 'User and message are required' });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Insert into YOUR table structure
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_name: user,
          text: message
        }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: err.message || "Something went wrong"
    });
  }
}