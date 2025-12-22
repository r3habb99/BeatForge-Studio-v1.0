/**
 * Footer Module
 * Renders the footer section of the landing page
 */

import { footerContent } from '../config/landingContent.js';
import { ASSETS } from '../constants/landing.js';

/**
 * Render footer HTML
 */
export function renderFooter() {
  return `
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="${ASSETS.LOGO}" alt="${ASSETS.LOGO_ALT}" class="footer-logo-img">
              <span class="footer-logo-text">${footerContent.brand.name}</span>
            </div>
            <p class="footer-tagline">${footerContent.brand.tagline}</p>
            <p class="footer-description">${footerContent.brand.description}</p>
            <div class="footer-social">
              ${footerContent.social.map(social => `
                <a href="${social.href}" class="footer-social-link" aria-label="${social.label}" target="_blank" rel="noopener noreferrer">
                  <i class="fab ${social.icon}"></i>
                </a>
              `).join('')}
            </div>
          </div>

          <!-- Product Links -->
          <div class="footer-links-group">
            <h4 class="footer-links-title">Product</h4>
            <ul class="footer-links">
              ${footerContent.links.product.map(link => `
                <li><a href="${link.href}" class="footer-link">${link.text}</a></li>
              `).join('')}
            </ul>
          </div>

          <!-- Resources Links -->
          <div class="footer-links-group">
            <h4 class="footer-links-title">Resources</h4>
            <ul class="footer-links">
              ${footerContent.links.resources.map(link => `
                <li><a href="${link.href}" class="footer-link">${link.text}</a></li>
              `).join('')}
            </ul>
          </div>

          <!-- Company Links -->
          <div class="footer-links-group">
            <h4 class="footer-links-title">Company</h4>
            <ul class="footer-links">
              ${footerContent.links.company.map(link => `
                <li><a href="${link.href}" class="footer-link">${link.text}</a></li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p class="footer-copyright">${footerContent.copyright}</p>
          <div class="footer-bottom-links">
            <a href="#" class="footer-bottom-link">Privacy Policy</a>
            <a href="#" class="footer-bottom-link">Terms of Service</a>
            <a href="#" class="footer-bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

