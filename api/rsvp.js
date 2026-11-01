// Tells the inviting clinician when a client accepts or declines. Requires RESEND_API_KEY.
const { limited, cors } = require('./_util');
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (limited(req, 10)) return res.status(429).json({ error: 'Too many requests' });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'Email is not configured' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const inv = body.invite || {}, answer = body.answer === 'accepted' ? 'accepted' : 'declined';
  const allowed = (process.env.STAFF_EMAIL_DOMAIN || 'successbrand.org').toLowerCase();
  // Only notify staff addresses, so this can't be used to email arbitrary people.
  if (!/^\S+@\S+\.\S+$/.test(inv.he || '') || !inv.he.toLowerCase().endsWith('@' + allowed)) return res.status(400).json({ error: 'No staff address to notify' });
  const when = new Date(inv.s).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';
  const who = esc(String(body.name || inv.n || 'A client').slice(0, 60));
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: process.env.INVITE_FROM || 'Success Brand <invites@successbrand.org>', to: [inv.he], subject: `${who} ${answer} your ${inv.t === 'g' ? 'group ' : ''}session invitation`,
      html: `<p>${who} <b>${answer}</b> your invitation for ${esc(inv.v)} on ${esc(when)} (${esc(inv.f)}).</p>` }),
  });
  if (!r.ok) return res.status(502).json({ error: 'Could not notify' });
  res.status(200).json({ ok: true });
};
