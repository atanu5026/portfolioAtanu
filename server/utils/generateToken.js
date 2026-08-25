const jwt = require('jsonwebtoken');

const generateToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none'
    sameSite: 'none', // Allow cross-site cookies (Vercel -> Render)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = generateToken;
