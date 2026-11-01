// Sage's AI answers. Forwards the visitor's chat to Claude with Sage's instructions.
// Requires ANTHROPIC_API_KEY. Optional: GUIDE_MODEL (default claude-haiku-5-5).
const { limited, cors } = require('./_util');
module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: 'Guide is not configured' });
  if (limited(req, 20)) return res.status(429).json({ error: 'Too many messages. Please wait a minute.' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  // Only Sage's own instructions are accepted, so the endpoint can't be used as a general AI proxy.
  const system = String(body.system || '');
  if (!system.startsWith('You are Sage')) return res.status(400).json({ error: 'Unexpected request' });
  const msgs = [];
  for (const m of Array.isArray(body.messages) ? body.messages.slice(-14) : []) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || !m.content.trim()) continue;
    const content = m.content.slice(0, 4000);
    if (msgs.length && msgs[msgs.length - 1].role === m.role) msgs[msgs.length - 1].content += '\n\n' + content;
    else msgs.push({ role: m.role, content });
  }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'No message' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.GUIDE_MODEL || 'claude-haiku-5-5', max_tokens: 600, system: system.slice(0, 24000), messages: msgs }),
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: j.error?.message || 'Guide error' });
    const reply = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    res.status(200).json({ reply });
  } catch (e) {
    res.status(502).json({ error: 'Guide unavailable' });
  }
};
