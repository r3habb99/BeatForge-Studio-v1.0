/**
 * Hero Section Module
 * Renders the hero section of the landing page
 */

import { heroContent } from '../config/landingContent.js';
import { A11Y } from '../constants/landing.js';

/**
 * Render hero section HTML
 */
export function renderHero() {
  return `
    <section class="hero-section" aria-label="${A11Y.MAIN_LABEL}">
      <div class="hero-bg-animation"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <i class="fas ${heroContent.badge.icon}"></i>
          <span>${heroContent.badge.text}</span>
        </div>
        <h1 class="hero-title">
          ${heroContent.title.main}
          <span class="hero-title-gradient">${heroContent.title.gradient}</span>
          ${heroContent.title.suffix}
        </h1>
        <p class="hero-subtitle">
          ${heroContent.subtitle}
        </p>
        <div class="hero-cta-group">
          <a href="${heroContent.cta.primary.href}" class="hero-cta-primary">
            <i class="fas ${heroContent.cta.primary.icon}"></i>
            <span>${heroContent.cta.primary.text}</span>
          </a>
          <a href="${heroContent.cta.secondary.href}" class="hero-cta-secondary">
            <span>${heroContent.cta.secondary.text}</span>
            <i class="fas ${heroContent.cta.secondary.icon}"></i>
          </a>
        </div>
        <div class="hero-stats">
          ${heroContent.stats.map(stat => `
            <div class="hero-stat">
              <span class="hero-stat-number">${stat.number}</span>
              <span class="hero-stat-label">${stat.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

