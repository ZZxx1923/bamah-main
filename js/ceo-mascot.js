/* ==========================================================================
   BASMA AHED — ceo-mascot.js
   Lightweight 2D SVG hard-hat engineer mascot (no WebGL/Three.js needed).
   Same flat cartoon style used across the site, with a few looping CSS
   animations so it reads as alive: idle bob, arm sway, and a periodic blink.
   ========================================================================== */

(function () {
  'use strict';

  function boot() {
    const mount = document.getElementById('ceoMascot3D');
    if (!mount) return;

    mount.innerHTML = `
<svg class="mascot-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <g class="mascot-figure">
    <ellipse cx="100" cy="228" rx="46" ry="8" fill="#000" opacity="0.18"/>

    <!-- legs -->
    <rect x="80" y="168" width="16" height="52" rx="6" fill="#2c2c2a"/>
    <rect x="104" y="168" width="16" height="52" rx="6" fill="#2c2c2a"/>
    <ellipse cx="86" cy="221" rx="13" ry="7" fill="#17181a"/>
    <ellipse cx="114" cy="221" rx="13" ry="7" fill="#17181a"/>

    <!-- arms -->
    <g class="mascot-arm mascot-arm-l">
      <rect x="14" y="102" width="58" height="16" rx="8" fill="#7fb8e6"/>
      <ellipse cx="18" cy="110" rx="11" ry="9" fill="#e0ac80"/>
    </g>
    <g class="mascot-arm mascot-arm-r">
      <rect x="128" y="102" width="58" height="16" rx="8" fill="#7fb8e6"/>
      <ellipse cx="182" cy="110" rx="11" ry="9" fill="#e0ac80"/>
    </g>

    <!-- torso -->
    <rect x="70" y="98" width="60" height="34" rx="10" fill="#7fb8e6"/>
    <path d="M74 100 Q100 90 126 100 L132 168 Q100 182 68 168 Z" fill="#f2932a"/>
    <rect x="70" y="126" width="60" height="9" fill="#f5f0e6"/>
    <rect x="70" y="148" width="60" height="9" fill="#f5f0e6"/>
    <text x="100" y="142" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif" font-weight="700" font-size="6.2" letter-spacing="0.2" fill="#4a1b0c">BASMA AHED</text>

    <!-- collar -->
    <path d="M92 96 L100 110 L108 96 Z" fill="#f5f0e6"/>

    <!-- neck + head -->
    <rect x="90" y="80" width="20" height="16" rx="5" fill="#e0ac80"/>
    <ellipse cx="100" cy="60" rx="28" ry="29" fill="#e9b78d"/>

    <!-- hair -->
    <path d="M74 52 Q73 36 90 30 Q78 44 78 58 Z" fill="#4a3826"/>
    <path d="M126 52 Q127 36 110 30 Q122 44 122 58 Z" fill="#4a3826"/>

    <!-- hard hat -->
    <path d="M72 44 Q100 14 128 44 Z" fill="#f2b71a"/>
    <rect x="66" y="41" width="68" height="9" rx="4.5" fill="#e0a80e"/>
    <rect x="94" y="22" width="12" height="9" rx="3" fill="#e0a80e"/>

    <g class="mascot-eyes">
      <rect x="86" y="57" width="9" height="2.4" rx="1.2" fill="#3a2a1a"/>
      <rect x="105" y="57" width="9" height="2.4" rx="1.2" fill="#3a2a1a"/>
      <circle cx="90.5" cy="62" r="2.4" fill="#2a2a2a"/>
      <circle cx="109.5" cy="62" r="2.4" fill="#2a2a2a"/>
    </g>

    <path d="M100 63 L98 72 Q100 74 102 72 Z" fill="#d99f74"/>
    <path d="M84 75 Q100 81 116 75 Q108 78 100 78 Q92 78 84 75 Z" fill="#3a2a1a"/>
    <path d="M92 80 Q100 84 108 80" stroke="#7a4a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
