import { createClient } from '@supabase/supabase-js';

let supabase;

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase environment variables are missing.' });
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }

  const { message, user } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        user_name: user || 'G-Zone AI',
        text: message
      }
    ]);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true });
}
