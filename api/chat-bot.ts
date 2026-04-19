import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: "nodejs"
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, message } = req.body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error } = await supabase
      .from('messages') // 👈 check this table name
      .insert([{ user, message }]);

    if (error) throw error;

    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}