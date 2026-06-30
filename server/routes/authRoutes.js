import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'sultan_ansari_secret_key_123';

export function generateToken() {
  const payload = JSON.stringify({ role: 'admin', user: 'Sultan Ansari', expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

export function verifyToken(token) {
  try {
    const [payloadBase64, signature] = token.split('.');
    const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (signature !== expectedSignature) return null;
    const parsed = JSON.parse(payload);
    if (parsed.expires < Date.now()) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'sultan ansari';
  
  if (password === adminPassword) {
    const token = generateToken();
    return res.json({
      message: 'Login successful',
      token,
      user: {
        name: 'Sultan Ansari',
        email: 'sultan@enterprise.com'
      }
    });
  } else {
    return res.status(401).json({ message: 'Invalid admin password' });
  }
});

export default router;
