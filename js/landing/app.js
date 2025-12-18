/**
 * Landing Page Application
 * Main orchestrator for the landing page
 */

import { injectSEO } from "./seo.js";
import { renderNavigation, initNavigation } from "./navigation.js";
import { renderHero } from "./hero.js";
import { renderFeatures } from "./features.js";
import { renderSounds } from "./sounds.js";
import { renderEffects } from "./effects.js";
import { renderFooter } from "./footer.js";
import { initScrollAnimations } from "./animations.js";
import { A11Y } from "../constants/landing.js";

/**
 * Render all landing page components
 */
function renderComponents() {
  const body = document.body;

  // Create main structure
  const html = `
    <!-- Skip Navigation Link for Accessibility -->
    <a href="#main-content" class="skip-nav-link">${A11Y.SKIP_NAV_TEXT}</a>

    ${renderNavigation()}

    <!-- Main Content -->
    <main id="main-content">
      ${renderHero()}
      ${renderFeatures()}
      ${renderSounds()}
      ${renderEffects()}

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container">
          <h2 class="cta-title">Ready to Create Amazing Music?</h2>
          <p class="cta-subtitle">Start making beats and melodies right now. No sign-up required.</p>
          <a href="daw.html" class="cta-button">
            <i class="fas fa-rocket"></i>
            <span>Launch BeatForge Studio</span>
          </a>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;

  body.innerHTML = html;
}

/**
 * Initialize all landing page functionality
 */
function initLandingPage() {
  // Inject SEO meta tags
  injectSEO();

  // Render all components
  renderComponents();

  // Initialize interactions
  initNavigation();
  initScrollAnimations();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLandingPage);
} else {
  initLandingPage();
}
