<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Border Glow -->
    <linearGradient id="favBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>

    <!-- Main "B" Gradient -->
    <linearGradient id="favB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="50%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>

    <!-- Bolt Gradient -->
    <linearGradient id="favBolt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
  </defs>

  <!-- Squircle Base -->
  <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#favBg)"/>
  <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="none" stroke="url(#favBorder)" stroke-width="2"/>

  <!-- Shopping Bag Handle Arch -->
  <path d="M 24 20 C 24 13, 40 13, 40 20" 
        fill="none" 
        stroke="#38BDF8" 
        stroke-width="3" 
        stroke-linecap="round"/>

  <!-- Bag / B Base Silhouette -->
  <path d="M 20 20 L 44 20 C 46 20, 48 22, 47 24 L 45 48 C 44 50, 42 52, 40 52 L 24 52 C 22 52, 20 50, 19 48 L 17 24 C 16 22, 18 20, 20 20 Z" 
        fill="url(#favB)"/>

  <!-- Futuristic "B" Cutouts -->
  <rect x="27" y="26" width="10" height="7" rx="3.5" fill="#0B1120"/>
  <rect x="27" y="37" width="11" height="8" rx="4" fill="#0B1120"/>

  <!-- Speed Lightning Bolt in Center-Right -->
  <polygon points="36,15 28,32 35,32 29,49 46,29 37,29 42,15" 
           fill="url(#favBolt)"/>

  <!-- Tiny AI Star Dot -->
  <circle cx="50" cy="14" r="2.5" fill="#38BDF8"/>
</svg>
