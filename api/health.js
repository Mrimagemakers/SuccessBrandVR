// Tells the page which optional features this deployment can run.
const { cors } = require('./_util');
module.exports = (req, res) => {
  cors(res);
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    guide: !!process.env.ANTHROPIC_API_KEY,
    voice: !!(process.env.ELEVENLABS_API_KEY || process.env.OPENAI_API_KEY),
  });
};
