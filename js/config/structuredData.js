/**
 * Structured Data (JSON-LD) Configuration
 * Schema.org markup for rich search results
 */

import { APP_INFO, URLS, ASSETS } from '../constants/landing.js';

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": APP_INFO.NAME,
  "description": APP_INFO.DESCRIPTION,
  "url": URLS.BASE,
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "16-Step Sequencer",
    "13 Drum Sounds",
    "9 Synthesizers",
    "Piano Roll Editor",
    "Studio-Grade Effects",
    "Auto-Save",
    "Audio Export",
    "Multiple Themes",
    "Responsive Design",
    "PWA Support"
  ],
  "screenshot": `${URLS.BASE}${ASSETS.LOGO}`,
  "softwareVersion": APP_INFO.VERSION,
  "author": {
    "@type": "Organization",
    "name": APP_INFO.NAME
  }
};

