/**
 * SEO Configuration
 * Centralized SEO metadata for the landing page
 */

import { APP_INFO, URLS, ASSETS, THEME, SEO_KEYWORDS, SOCIAL, PWA } from '../constants/landing.js';

export const seoConfig = {
  // Basic Meta Tags
  title: `${APP_INFO.NAME} - ${APP_INFO.TAGLINE} | Create Music in Your Browser`,
  description: `${APP_INFO.NAME} - ${APP_INFO.DESCRIPTION}. Create music directly in your browser!`,
  keywords: SEO_KEYWORDS.join(", "),
  author: APP_INFO.NAME,
  robots: "index, follow",
  language: "English",
  
  // Open Graph / Facebook
  og: {
    type: "website",
    url: URLS.BASE,
    title: `${APP_INFO.NAME} - ${APP_INFO.TAGLINE}`,
    description: "Create professional beats and melodies with our browser-based DAW. 13 drum sounds, 9 synthesizers, piano roll editor, and studio effects.",
    image: `${URLS.BASE}${ASSETS.LOGO}`,
  },
  
  // Twitter Card
  twitter: {
    card: SOCIAL.TWITTER_CARD,
    url: URLS.BASE,
    title: `${APP_INFO.NAME} - ${APP_INFO.TAGLINE}`,
    description: "Create professional beats and melodies with our browser-based DAW. 13 drum sounds, 9 synthesizers, piano roll editor, and studio effects.",
    image: `${URLS.BASE}${ASSETS.LOGO}`,
  },
  
  // PWA Meta Tags
  pwa: {
    mobileWebAppCapable: PWA.MOBILE_CAPABLE,
    appleMobileWebAppCapable: PWA.APPLE_CAPABLE,
    appleMobileWebAppStatusBarStyle: PWA.STATUS_BAR_STYLE,
    appleMobileWebAppTitle: PWA.SHORT_NAME,
    applicationName: APP_INFO.NAME,
    themeColor: THEME.PRIMARY_COLOR,
    msApplicationTileColor: THEME.TILE_COLOR,
  },
  
  // Links
  canonical: URLS.BASE,
  manifest: "manifest.json",
  
  // Favicons
  favicons: {
    icon: ASSETS.LOGO,
    appleTouchIcon: ASSETS.LOGO,
  },
  
  // Preconnect URLs
  preconnect: [
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com",
  ],
  
  // Preload Resources
  preload: [
    { href: "css/landing.css", as: "style" },
  ],
};

