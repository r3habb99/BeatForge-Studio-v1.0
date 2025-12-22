/**
 * Sounds Section Module
 * Renders the sounds library section of the landing page
 */

import { soundsContent } from '../config/landingContent.js';
import { A11Y } from '../constants/landing.js';

/**
 * Render sounds section HTML
 */
export function renderSounds() {
  return `
    <section class="sounds-section" id="sounds" aria-label="${A11Y.SOUNDS_LABEL}">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">${soundsContent.header.title}</h2>
          <p class="section-subtitle">${soundsContent.header.subtitle}</p>
        </div>
        <div class="sounds-grid">
          ${soundsContent.categories.map(category => `
            <div class="sounds-category">
              <div class="sounds-category-header">
                <i class="fas ${category.icon}"></i>
                <h3>${category.title}</h3>
              </div>
              <ul class="sounds-list">
                ${category.sounds.map(sound => `
                  <li>
                    <span class="sound-color" style="background: ${sound.color};"></span>
                    ${sound.name}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

