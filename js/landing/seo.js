/**
 * SEO Module
 * Handles dynamic injection of SEO meta tags and structured data
 */

import { seoConfig } from '../config/seoConfig.js';
import { structuredData } from '../config/structuredData.js';

/**
 * Inject SEO meta tags into the document head
 */
export function injectSEO() {
  const head = document.head;

  // Set title
  document.title = seoConfig.title;

  // Basic meta tags
  setMetaTag('description', seoConfig.description);
  setMetaTag('keywords', seoConfig.keywords);
  setMetaTag('author', seoConfig.author);
  setMetaTag('robots', seoConfig.robots);
  setMetaTag('language', seoConfig.language);

  // Open Graph tags
  setMetaProperty('og:type', seoConfig.og.type);
  setMetaProperty('og:url', seoConfig.og.url);
  setMetaProperty('og:title', seoConfig.og.title);
  setMetaProperty('og:description', seoConfig.og.description);
  setMetaProperty('og:image', seoConfig.og.image);

  // Twitter Card tags
  setMetaProperty('twitter:card', seoConfig.twitter.card);
  setMetaProperty('twitter:url', seoConfig.twitter.url);
  setMetaProperty('twitter:title', seoConfig.twitter.title);
  setMetaProperty('twitter:description', seoConfig.twitter.description);
  setMetaProperty('twitter:image', seoConfig.twitter.image);

  // PWA meta tags
  setMetaTag('mobile-web-app-capable', seoConfig.pwa.mobileWebAppCapable);
  setMetaTag('apple-mobile-web-app-capable', seoConfig.pwa.appleMobileWebAppCapable);
  setMetaTag('apple-mobile-web-app-status-bar-style', seoConfig.pwa.appleMobileWebAppStatusBarStyle);
  setMetaTag('apple-mobile-web-app-title', seoConfig.pwa.appleMobileWebAppTitle);
  setMetaTag('application-name', seoConfig.pwa.applicationName);
  setMetaTag('theme-color', seoConfig.pwa.themeColor);
  setMetaTag('msapplication-TileColor', seoConfig.pwa.msApplicationTileColor);

  // Canonical link
  setLinkTag('canonical', seoConfig.canonical);

  // Manifest
  setLinkTag('manifest', seoConfig.manifest);

  // Favicons
  setLinkTag('icon', seoConfig.favicons.icon, 'image/png');
  setLinkTag('apple-touch-icon', seoConfig.favicons.appleTouchIcon);

  // Preconnect
  seoConfig.preconnect.forEach(url => {
    setLinkTag('preconnect', url);
  });

  // Preload
  seoConfig.preload.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    head.appendChild(link);
  });

  // Inject structured data
  injectStructuredData();
}

/**
 * Set a meta tag with name attribute
 */
function setMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/**
 * Set a meta tag with property attribute
 */
function setMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/**
 * Set a link tag
 */
function setLinkTag(rel, href, type = null) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
  if (type) {
    link.type = type;
  }
}

/**
 * Inject structured data (JSON-LD) into the document
 */
function injectStructuredData() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData, null, 2);
  document.head.appendChild(script);
}

