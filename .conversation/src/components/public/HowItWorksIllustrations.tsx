import React from 'react';

// Common circular badge wrapper with dark outline and cheerful pastel palette
// matching the user's reference image style (bold outlines, pastel circle, floating badges).

export const Step1Illustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Base Circle */}
    <circle cx="60" cy="60" r="48" fill="#D3F0EB" stroke="#1E293B" strokeWidth="3" />
    
    {/* Document / Form */}
    <rect x="36" y="28" width="40" height="54" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="42" y="38" width="10" height="8" rx="2" fill="#FDBA74" stroke="#1E293B" strokeWidth="2" />
    <line x1="56" y1="40" x2="70" y2="40" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="56" y1="46" x2="68" y2="46" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="54" x2="70" y2="54" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="62" x2="62" y2="62" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="70" x2="56" y2="70" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

    {/* Pencil */}
    <g transform="rotate(-30 78 48)">
      <path d="M72 32 L84 32 L84 56 L78 64 L72 56 Z" fill="#F97316" stroke="#1E293B" strokeWidth="2" />
      <path d="M72 32 L84 32 L84 36 L72 36 Z" fill="#FCA5A5" stroke="#1E293B" strokeWidth="2" />
      <polygon points="76,61 80,61 78,65" fill="#1E293B" />
    </g>

    {/* Small Camera / Photo floating badge at top-right */}
    <circle cx="88" cy="34" r="14" fill="#6366F1" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="80" y="29" width="16" height="11" rx="2.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="88" cy="34.5" r="3" fill="#6366F1" stroke="#1E293B" strokeWidth="1.5" />
    <rect x="83" y="27" width="5" height="2.5" rx="1" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />

    {/* Checkmark Seal at bottom-left */}
    <circle cx="40" cy="80" r="10" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
    <path d="M36 80 L39 83 L45 77" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Step2Illustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Base Circle */}
    <circle cx="60" cy="60" r="48" fill="#D3EDF8" stroke="#1E293B" strokeWidth="3" />

    {/* Service Selection App Window / Catalog */}
    <rect x="32" y="30" width="46" height="58" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="37" y="37" width="36" height="6" rx="2" fill="#E2E8F0" />
    <line x1="41" y1="40" x2="52" y2="40" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

    {/* Grid of category tiles */}
    <rect x="37" y="47" width="16" height="16" rx="3" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.5" />
    {/* Broom/paint icon inside tile 1 */}
    <path d="M42 58 L48 52" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <path d="M47 51 L50 54" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

    <rect x="57" y="47" width="16" height="16" rx="3" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.5" />
    {/* Wrench icon inside tile 2 */}
    <circle cx="65" cy="55" r="3" stroke="#D97706" strokeWidth="1.5" />

    <rect x="37" y="67" width="16" height="15" rx="3" fill="#DCFCE7" stroke="#1E293B" strokeWidth="1.5" />
    {/* Leaf/Plant icon inside tile 3 */}
    <path d="M42 77 C42 71 49 70 51 72 C51 76 47 78 42 77 Z" fill="#22C55E" />

    <rect x="57" y="67" width="16" height="15" rx="3" fill="#F3E8FF" stroke="#1E293B" strokeWidth="1.5" />

    {/* Large floating Location & Calendar Badge at top-right */}
    <circle cx="86" cy="42" r="16" fill="#00C29E" stroke="#1E293B" strokeWidth="2.5" />
    {/* Map Pin */}
    <path d="M86 33 C82.5 33 80 35.5 80 38.8 C80 43.5 86 49.5 86 49.5 C86 49.5 92 43.5 92 38.8 C92 35.5 89.5 33 86 33 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="86" cy="38.5" r="2" fill="#00C29E" />
  </svg>
);

export const Step3Illustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Base Circle */}
    <circle cx="60" cy="60" r="48" fill="#D3F0EB" stroke="#1E293B" strokeWidth="3" />

    {/* Palm / Hand supporting services (like Step 3 in user image) */}
    {/* Cuff */}
    <rect x="22" y="66" width="14" height="22" rx="3" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="28" y1="72" x2="28" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    
    {/* Hand pointing right, open palm */}
    <path d="M36 71 L56 71 C62 71 67 74 74 74 C80 74 86 70 88 68 C88.5 67 89.5 67.5 89 69 C86 75 79 81 72 82 C65 83 48 83 48 83 L36 83 Z" fill="#FED7AA" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 71 C54 67 60 67 65 67 C66 67 67 69 65 71 Z" fill="#FED7AA" stroke="#1E293B" strokeWidth="2" />

    {/* Hovering Verified Professional Badge & Tools above the hand */}
    {/* Wrench */}
    <g transform="rotate(-35 56 46)">
      <path d="M50 43 L68 43 L68 47 L50 47 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
      <path d="M49 41 C47 43 47 47 49 49 L46 51 C43 48 43 42 46 39 Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
      <circle cx="68" cy="45" r="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
    </g>

    {/* Screwdriver */}
    <g transform="rotate(35 68 42)">
      <rect x="62" y="38" width="16" height="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
      <rect x="74" y="36.5" width="10" height="7" rx="1.5" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
    </g>

    {/* Shield Verified Badge at top */}
    <circle cx="60" cy="30" r="13" fill="#00C29E" stroke="#1E293B" strokeWidth="2.5" />
    <path d="M60 22 L67 25 C67 30 63.5 34 60 36 C56.5 34 53 30 53 25 L60 22 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M57 29 L59 31 L63 27" stroke="#00C29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Sparks */}
    <path d="M78 28 L81 25" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M84 31 L87 31" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 35 L39 33" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Step4Illustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Base Circle */}
    <circle cx="60" cy="60" r="48" fill="#FCE7F3" stroke="#1E293B" strokeWidth="3" />

    {/* Home / Doorstep where professional arrives */}
    <path d="M34 54 L60 33 L86 54 L86 86 C86 87.5 84.5 89 83 89 L37 89 C35.5 89 34 87.5 34 86 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
    {/* Roof trim */}
    <path d="M30 56 L60 32 L90 56" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
    {/* Chimney */}
    <rect x="74" y="34" width="7" height="12" fill="#F97316" stroke="#1E293B" strokeWidth="2" />

    {/* Door */}
    <rect x="49" y="61" width="18" height="28" rx="2" fill="#FED7AA" stroke="#1E293B" strokeWidth="2" />
    <circle cx="63" cy="75" r="2" fill="#1E293B" />

    {/* Window */}
    <circle cx="60" cy="48" r="5" fill="#93C5FD" stroke="#1E293B" strokeWidth="1.5" />
    <line x1="60" y1="43" x2="60" y2="53" stroke="#1E293B" strokeWidth="1" />
    <line x1="55" y1="48" x2="65" y2="48" stroke="#1E293B" strokeWidth="1" />

    {/* Toolkit / Service equipment at doorstep */}
    <rect x="69" y="74" width="22" height="15" rx="3" fill="#0284C7" stroke="#1E293B" strokeWidth="2" />
    <path d="M76 74 V71 C76 69.5 77.5 68.5 79 68.5 H81 C82.5 68.5 84 69.5 84 71 V74" stroke="#1E293B" strokeWidth="2" fill="none" />
    <line x1="69" y1="79" x2="91" y2="79" stroke="#38BDF8" strokeWidth="1.5" />

    {/* Floating On-Time / Clock Confirmation Badge at top-right */}
    <circle cx="88" cy="36" r="14" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="88" cy="36" r="10" fill="#FFFFFF" />
    <path d="M88 31 V36.5 L91.5 39" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Step5Illustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Base Circle */}
    <circle cx="60" cy="60" r="48" fill="#D3EDF8" stroke="#1E293B" strokeWidth="3" />

    {/* Thumbs Up Hand (matching Step 4 in user reference image) */}
    {/* Cuff */}
    <rect x="34" y="60" width="16" height="24" rx="3" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="42" y1="66" x2="42" y2="78" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Fist & Thumbs Up */}
    <path d="M50 63 L65 63 C69 63 71 67 69 70 C72 70 74 74 72 77 C74 77 75 80 73 83 C71 85 64 85 50 85 Z" fill="#FED7AA" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Upright Thumb */}
    <path d="M50 64 C50 60 52 50 55 45 C57.5 41 61 41 61 45 C61 49 59 56 61 63" fill="#FED7AA" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />

    {/* Speech Bubble with feedback dots (like the user image) */}
    <g transform="translate(68, 26)">
      <path d="M6 0 H28 C31.3 0 34 2.7 34 6 V20 C34 23.3 31.3 26 28 26 H14 L6 32 V26 C2.7 26 0 23.3 0 20 V6 C0 2.7 2.7 0 6 0 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="10" cy="13" r="2.2" fill="#FFFFFF" />
      <circle cx="17" cy="13" r="2.2" fill="#FFFFFF" />
      <circle cx="24" cy="13" r="2.2" fill="#FFFFFF" />
    </g>

    {/* Floating Secure Payment / UPI Rupee Badge at bottom-left */}
    <circle cx="36" cy="85" r="13" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
    <text x="36" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">₹</text>
  </svg>
);
