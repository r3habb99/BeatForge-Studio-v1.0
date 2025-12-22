/**
 * Effects Section Module
 * Renders the effects section of the landing page
 */

import { effectsContent } from '../config/landingContent.js';
import { A11Y } from '../constants/landing.js';

/**
 * Render effects section HTML
 */
export function renderEffects() {
  return `
    <section class="effects-section" id="effects" aria-label="${A11Y.EFFECTS_LABEL}">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">${effectsContent.header.title}</h2>
          <p class="section-subtitle">${effectsContent.header.subtitle}</p>
        </div>
        <div class="effects-grid">
          ${effectsContent.effects.map(effect => `
            <div class="effect-landing-card">
              <div class="effect-landing-icon">
                <i class="fas ${effect.icon}"></i>
              </div>
              <h3 class="effect-landing-title">${effect.title}</h3>
              <p class="effect-landing-description">${effect.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

