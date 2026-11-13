'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_SELECTOR = [
  '.section-heading',
  '.intro-grid > *',
  '.spotlight-head',
  '.spotlight-tile',
  '.way-card',
  '.councillor-visual',
  '.councillor-copy',
  '.community-band-inner',
  '.explore-photo',
  '.explore-stack > a',
  '.page-section > .container > .page-title',
  '.page-section > .container > .page-lead',
  '.info-card',
  '.listing-card',
  '.gallery-entry',
  '.pro-card',
  '.former-card',
  '.nearest-card',
  '.ward-special-card',
  '.history-article-card',
  '.history-callout',
  '.social-card',
  '.stat-box',
  '.form-card',
  '.directory-promo',
  '.footer-top',
  '.footer-grid > div'
].join(', ');

function isExcluded(el: Element): boolean {
  return Boolean(
    el.closest('.hero, .inner-hero, .site-header, .mobile-bottom, .mobile-drawer, .hello-overlay, .admin-modal-backdrop')
  );
}

/**
 * Adds progressive, GPU-composited scroll reveals across public pages
 * without altering layout, alignment, hover transforms, or sticky panels.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    // Leave admin control room instant when switching tabs and honour reduced-motion.
    if (pathname.startsWith('/admin') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('sr-enabled');
      document.querySelectorAll('[data-sr]').forEach((el) => {
        el.removeAttribute('data-sr');
        el.removeAttribute('data-sr-delay');
      });
      return;
    }

    root.classList.add('sr-enabled');

    const cleanupDone = (el: Element) => {
      window.setTimeout(() => {
        if (el.getAttribute('data-sr') === 'in') {
          el.setAttribute('data-sr', 'done');
          el.removeAttribute('data-sr-delay');
        }
      }, 780);
    };

    const reveal = (el: Element) => {
      if (el.getAttribute('data-sr') !== 'pending') return;
      el.setAttribute('data-sr', 'in');
      cleanupDone(el);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let wave = 0;
        const maxStagger = window.innerWidth <= 760 ? 2 : 3;
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            const el = entry.target;
            el.setAttribute('data-sr-delay', String(wave % maxStagger));
            wave += 1;
            reveal(el);
            observer.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -24px 0px', threshold: 0.02 }
    );

    const registerElements = (scope: ParentNode) => {
      const candidates = scope.querySelectorAll(REVEAL_SELECTOR);
      const viewportCutoff = window.innerHeight * 0.94;
      const maxStagger = window.innerWidth <= 760 ? 2 : 3;
      let dynamicIdx = 0;

      candidates.forEach((el) => {
        if (el.hasAttribute('data-sr') || isExcluded(el)) return;
        const rect = el.getBoundingClientRect();

        // Keep initially visible or already-passed content crisp immediately.
        if (rect.top <= viewportCutoff) {
          el.setAttribute('data-sr', 'done');
          return;
        }

        el.setAttribute('data-sr', 'pending');
        el.setAttribute('data-sr-delay', String(dynamicIdx % maxStagger));
        dynamicIdx += 1;
        observer.observe(el);
      });
    };

    const sweepVisible = () => {
      const cutoff = window.innerHeight * 0.98;
      document.querySelectorAll('[data-sr="pending"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= cutoff) {
          reveal(el);
          observer.unobserve(el);
        }
      });
    };

    registerElements(document);

    const mutationObserver = new MutationObserver(() => {
      registerElements(document);
      sweepVisible();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        sweepVisible();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const safetyTimer = window.setInterval(sweepVisible, 900);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearInterval(safetyTimer);
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
    };
  }, [pathname]);

  return null;
}
