/**
 * Animations Module
 * Handles scroll-based animations and intersection observers
 */

import { ANIMATION } from '../constants/landing.js';

/**
 * Initialize scroll animations
 */
export function initScrollAnimations() {
  // Intersection Observer for Entrance Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: ANIMATION.THRESHOLD
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatableElements = document.querySelectorAll(
    '.feature-card, .sounds-category, .effect-landing-card, .hero-content, .section-header'
  );
  
  animatableElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    animationObserver.observe(el);
  });
}

/**
 * Initialize parallax effects (optional enhancement)
 */
export function initParallax() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

