// Emails session invitations (with a calendar file) and verifies the staff access code.
// Requires STAFF_CODE and RESEND_API_KEY. Optional: INVITE_FROM (a sender on a domain verified in Resend).
const { limited, cors } = require('./_util');
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (limited(req, 20)) return res.status(429).json({ error: 'Too many requests' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (!process.env.STAFF_CODE || body.staffCode !== process.env.STAFF_CODE) return res.status(401).json({ error: 'Staff access code not accepted' });
  if (body.check) return res.status(200).json({ ok: true });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'Email is not configured' });
  const inv = body.invite || {}, link = String(body.link || ''), ics = String(body.ics || '');
  const to = (Array.isArray(body.recipients) ? body.recipients : []).filter(r => r && /^\S+@\S+\.\S+$/.test(r.email)).slice(0, 30);
  if (!to.length || !inv.s || !link.includes('#invite-')) return res.status(400).json({ error: 'Missing invitation details' });
  const when = new Date(inv.s).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';
  const subject = `Invitation: ${inv.t === 'g' ? 'group session' : 'session'} with ${inv.h}`;
  const html = name => `<div style="font-family:Arial,sans-serif;max-width:520px;color:#1d1b18">
    <p>Hi${name ? ' ' + esc(name) : ''},</p><p>${esc(inv.h)} has invited you to ${inv.t === 'g' ? 'a group session' : 'a session'} at Success Brand.</p>
    <p><b>${esc(inv.v)}</b><br>${esc(when)} · ${Number(inv.d) || 50} minutes<br>${esc(inv.f)}</p>${inv.m ? `<p style="border-left:3px solid #E3B62E;padding-left:10px">${esc(inv.m)}</p>` : ''}
    <p><a href="${esc(link)}" style="background:#E3B62E;color:#1a1408;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Open your invitation</a></p>
    <p style="font-size:12px;color:#6b6457">If you're in crisis, call or text 988. In an emergency, call 911.<br>Success Brand · (404) 775-0331 · info@successbrand.org</p></div>`;
  const from = process.env.INVITE_FROM || 'Success Brand <invites@successbrand.org>';
  const attachments = ics ? [{ filename: 'success-brand-session.ics', content: Buffer.from(ics).toString('base64') }] : undefined;
  let sent = 0;
  for (const r of to) {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: [r.email], reply_to: inv.he || undefined, subject, html: html(inv.t === 'g' ? '' : r.name), attachments }),
    });
    if (resp.ok) sent++;
  }
  if (!sent) return res.status(502).json({ error: 'Email service rejected the invitations' });
  res.status(200).json({ sent });
};
