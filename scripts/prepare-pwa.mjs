// Cherry Bloom — Post-Export PWA Injector for Expo Web / Vercel
// Ensures dist/index.html links /manifest.json, iOS PWA meta tags, and registers /sw.js.

import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`[prepare-pwa] Error: ${indexHtmlPath} not found.`);
  process.exit(1);
}

let html = fs.readFileSync(indexHtmlPath, 'utf8');

const pwaHeadTags = `
    <!-- Cherry Bloom PWA Meta & Manifest -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#D91E36" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Cherry Bloom" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <style>
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #251A20;
        user-select: none;
        -webkit-user-select: none;
        overscroll-behavior: none;
      }
    </style>`;

const swScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${pwaHeadTags}\n  </head>`);
}

if (!html.includes("serviceWorker.register('/sw.js')")) {
  html = html.replace('</body>', `${swScript}\n  </body>`);
}

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('[prepare-pwa] PWA manifest, iOS meta tags, and Service Worker injected into dist/index.html.');
