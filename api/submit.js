export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan.' });
  }
  const gasUrl = process.env.GAS_WEB_APP_URL;
  const sharedSecret = process.env.GAS_SHARED_SECRET;
  if (!gasUrl || !sharedSecret) {
    return res.status(500).json({ success: false, message: 'Konfigurasi backend belum lengkap. Hubungi administrator.' });
  }
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') return res.status(400).json({ success: false, message: 'Payload formulir tidak valid.' });
    const body = new URLSearchParams({ payload: JSON.stringify(payload), secret: sharedSecret });
    const upstream = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body,
      redirect: 'follow'
    });
    const raw = await upstream.text();
    let result;
    try { result = JSON.parse(raw); } catch { result = null; }
    if (!upstream.ok || !result || typeof result.success !== 'boolean') {
      console.error('Unexpected Apps Script response', upstream.status, raw.slice(0, 200));
      return res.status(502).json({ success: false, message: 'Backend Google Apps Script mengembalikan respons yang tidak dikenali.' });
    }
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('ASTER proxy error:', error);
    return res.status(502).json({ success: false, message: 'Tidak dapat menghubungi backend Google Apps Script. Silakan coba kembali.' });
  }
}
