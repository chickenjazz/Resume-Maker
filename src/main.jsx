import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import favicon16 from './assets/favicon_io/favicon-16x16.png';
import favicon32 from './assets/favicon_io/favicon-32x32.png';
import faviconIco from './assets/favicon_io/favicon.ico';
import appleTouchIcon from './assets/favicon_io/apple-touch-icon.png';
import androidIcon192 from './assets/favicon_io/android-chrome-192x192.png';
import androidIcon512 from './assets/favicon_io/android-chrome-512x512.png';
import webManifest from './assets/favicon_io/site.webmanifest';

const iconLinks = [
  { rel: 'icon', type: 'image/x-icon', href: faviconIco },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16 },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32 },
  { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIcon },
  { rel: 'icon', type: 'image/png', sizes: '192x192', href: androidIcon192 },
  { rel: 'icon', type: 'image/png', sizes: '512x512', href: androidIcon512 },
  { rel: 'manifest', href: webManifest }
];

iconLinks.forEach(attributes => {
  const link = document.createElement('link');
  Object.entries(attributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });
  document.head.appendChild(link);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
