const recipient = 'brian@elliservices.com.au';
const maxLength = 5000;

function value(input, limit = 500) {
  return typeof input === 'string' ? input.trim().slice(0, limit) : '';
}

function escapeHtml(input) {
  return input.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function textLine(label, input) {
  return `<tr><td style="padding:8px 14px 8px 0;color:#765035;font-weight:700;vertical-align:top">${label}</td><td style="padding:8px 0;color:#30251d">${escapeHtml(input || '—')}</td></tr>`;
}

module.exports = async function contact(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = request.body || {};
  if (value(body.website)) {
    response.status(200).json({ ok: true });
    return;
  }

  const enquiry = {
    name: value(body.name),
    email: value(body.email),
    phone: value(body.phone),
    address: value(body.address),
    district: value(body.district),
    service: value(body.service),
    message: value(body.message, maxLength)
  };

  if (!enquiry.name || !enquiry.message || !/^\S+@\S+\.\S+$/.test(enquiry.email)) {
    response.status(400).json({ error: 'Please provide your name, a valid email address and a description of the work.' });
    return;
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    response.status(503).json({ error: 'The enquiry service is not configured yet. Please call 0405 878 406.' });
    return;
  }

  const html = `<!doctype html><html><body style="margin:0;background:#f3eee7;font-family:Arial,sans-serif;color:#30251d"><main style="max-width:680px;margin:24px auto;background:#fffdf9;border-top:5px solid #b56837;padding:28px"><p style="margin:0 0 8px;color:#765035;font-size:12px;font-weight:700;letter-spacing:.12em">NEW WEBSITE ENQUIRY</p><h1 style="margin:0 0 20px;font-size:26px">Canberra carpentry enquiry</h1><table style="border-collapse:collapse;width:100%;font-size:15px">${textLine('Name', enquiry.name)}${textLine('Email', enquiry.email)}${textLine('Phone', enquiry.phone)}${textLine('Property address', enquiry.address)}${textLine('District or area', enquiry.district)}${textLine('Service', enquiry.service)}</table><hr style="border:0;border-top:1px solid #d8cbbb;margin:22px 0"><h2 style="font-size:17px;margin:0 0 8px">Work details</h2><p style="white-space:pre-wrap;line-height:1.6;margin:0">${escapeHtml(enquiry.message)}</p></main></body></html>`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [recipient],
        reply_to: enquiry.email,
        subject: `Website enquiry — ${enquiry.name}`,
        html
      })
    });
    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error('Resend rejected enquiry', result);
      response.status(502).json({ error: 'We could not send your enquiry. Please call 0405 878 406.' });
      return;
    }
    response.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    console.error('Resend request failed', error);
    response.status(502).json({ error: 'We could not send your enquiry. Please call 0405 878 406.' });
  }
};
