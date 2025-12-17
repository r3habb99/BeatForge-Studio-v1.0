/**
 * Navigation Module
 * Handles navigation rendering and interactions
 */

import { APP_INFO, ASSETS, NAV_LINKS, URLS, ANIMATION, A11Y } from '../constants/landing.js';

/**
 * Render navigation HTML
 */
export function renderNavigation() {
  return `
    <nav class="landing-nav" role="navigation" aria-label="${A11Y.NAV_LABEL}">
      <div class="nav-container">
        <div class="nav-logo">
          <img src="${ASSETS.LOGO}" alt="${ASSETS.LOGO_ALT}" class="nav-logo-img" loading="eager">
          <span class="nav-logo-text">${APP_INFO.NAME}</span>
        </div>
        <div class="nav-links">
          ${NAV_LINKS.map(link => `<a href="${link.href}" class="nav-link">${link.label}</a>`).join('')}
          <a href="${URLS.DAW}" class="nav-cta-btn">Launch Studio</a>
        </div>
        <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <div class="mobile-nav-menu" id="mobileNavMenu">
      <div class="mobile-nav-header">
        <span class="mobile-nav-title">${APP_INFO.NAME}</span>
        <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close navigation">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="mobile-nav-links">
        ${NAV_LINKS.map(link => `<a href="${link.href}" class="mobile-nav-link">${link.label}</a>`).join('')}
        <a href="${URLS.DAW}" class="mobile-nav-cta">Launch Studio</a>
      </div>
    </div>
  `;
}

/**
 * Initialize navigation interactions
 */
export function initNavigation() {
  const landingNav = document.querySelector('.landing-nav');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!landingNav || !mobileNavToggle || !mobileNavMenu) {
    console.warn('[Navigation] Required elements not found');
    return;
  }

  // Mobile menu toggle
  mobileNavToggle.addEventListener('click', () => {
    mobileNavMenu.classList.toggle('open');
    const icon = mobileNavToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Mobile menu close button
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      mobileNavMenu.classList.remove('open');
      const icon = mobileNavToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileNavMenu.classList.remove('open');
      const icon = mobileNavToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll-based Navigation Background
  function updateNavOnScroll() {
    if (window.scrollY > ANIMATION.NAV_SCROLL_THRESHOLD) {
      landingNav.classList.add('nav-scrolled');
    } else {
      landingNav.classList.remove('nav-scrolled');
    }
  }

  // Scroll Spy - Highlight Active Section in Navigation
  function updateActiveNavLink() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - ANIMATION.NAV_OFFSET;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav-link-active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('nav-link-active');
      }
    });
  }

  // Scroll event listeners
  window.addEventListener('scroll', () => {
    updateNavOnScroll();
    updateActiveNavLink();
  });

  // Initial calls
  updateNavOnScroll();
  updateActiveNavLink();
}

