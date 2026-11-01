// Sage's studio voice. Uses ElevenLabs when ELEVENLABS_API_KEY is set, otherwise OpenAI text-to-speech.
// ElevenLabs: ELEVENLABS_API_KEY, optional ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL.
// OpenAI:     OPENAI_API_KEY, optional OPENAI_TTS_MODEL (default gpt-4o-mini-tts), OPENAI_TTS_VOICE (default coral).
const { limited, cors } = require('./_util');
const STYLE = 'Speak as Sage, a warm, calm and reassuring wellness guide. Unhurried pace, gentle warmth, natural pauses. Never sound salesy.';
module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (limited(req, 40)) return res.status(429).json({ error: 'Too many requests' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const text = String(body.text || '').slice(0, 900).trim();
  if (!text) return res.status(400).json({ error: 'No text' });
  try {
    let r;
    if (process.env.ELEVENLABS_API_KEY) {
      const voice = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
      r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2', voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.25 } }),
      });
    } else if (process.env.OPENAI_API_KEY) {
      r = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', voice: process.env.OPENAI_TTS_VOICE || 'coral', input: text, instructions: STYLE, response_format: 'mp3' }),
      });
    } else {
      return res.status(503).json({ error: 'Voice is not configured' });
    }
    if (!r.ok) return res.status(502).json({ error: 'Voice service error' });
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buf);
  } catch (e) {
    res.status(502).json({ error: 'Voice unavailable' });
  }
};
