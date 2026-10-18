import sharp from 'sharp';
import path from 'node:path';

const photoSvg = `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#1E40AF"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <!-- Person silhouette / portrait illustration -->
  <circle cx="400" cy="380" r="180" fill="#F8FAFC"/>
  <ellipse cx="400" cy="800" rx="280" ry="220" fill="#F8FAFC"/>
  <!-- Face details -->
  <circle cx="340" cy="360" r="18" fill="#1E293B"/>
  <circle cx="460" cy="360" r="18" fill="#1E293B"/>
  <path d="M 360 440 Q 400 480 440 440" stroke="#1E293B" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- Graduation / formal collar -->
  <polygon points="400,560 320,680 480,680" fill="#D97706"/>
</svg>
`;

sharp(Buffer.from(photoSvg))
  .jpeg({ quality: 90 })
  .toFile(path.resolve('public/test-portrait.jpg'))
  .then(() => console.log('Test portrait generated at public/test-portrait.jpg'))
  .catch(err => console.error(err));
