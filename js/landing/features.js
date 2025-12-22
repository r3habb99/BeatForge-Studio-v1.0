/**
 * Features Section Module
 * Renders the features section of the landing page
 */

import { featuresContent } from '../config/landingContent.js';
import { A11Y } from '../constants/landing.js';

/**
 * Render features section HTML
 */
export function renderFeatures() {
  return `
    <section class="features-section" id="features" aria-label="${A11Y.FEATURES_LABEL}">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">${featuresContent.header.title}</h2>
          <p class="section-subtitle">${featuresContent.header.subtitle}</p>
        </div>
        <div class="features-grid">
          ${featuresContent.features.map(feature => `
            <div class="feature-card">
              <div class="feature-icon feature-icon-${feature.iconColor}">
                <i class="fas ${feature.icon}"></i>
              </div>
              <h3 class="feature-title">${feature.title}</h3>
              <p class="feature-description">${feature.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

