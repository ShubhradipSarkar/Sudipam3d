/* ============================================================
   SUDIPAM SARKAR — PORTFOLIO SCRIPT
   Vanilla JS: nav state, mobile menu, scroll reveal,
   click-to-play YouTube embeds (thumbnail → iframe swap)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav background on scroll ─────────────────── */
  const navbar = document.getElementById('navbar');
  const setNavState = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  /* ── Mobile hamburger menu ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll reveal animation ─────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    /* Skill bar fill-in on view */
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    skillCards.forEach((el) => skillObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── Smooth scroll offset for fixed nav ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Click-to-play YouTube embeds ────────────────────────
     Loading a lightweight thumbnail first (instead of a live
     iframe on page load) is faster and avoids YouTube blocking
     iframes opened directly from a local file:// page. The
     real <iframe> is only created after a click, using the
     standard youtube-nocookie embed endpoint. ─────────────── */

  // maxresdefault.jpg doesn't exist for every video; fall back to
  // hqdefault.jpg, then to a clean drawn placeholder if YouTube's
  // thumbnail CDN is unreachable on the visitor's network at all.
  document.querySelectorAll('.video-thumb img[loading="lazy"]').forEach((img) => {
    img.addEventListener('error', function maxresFallback() {
      const videoId = this.closest('.video-thumb').getAttribute('data-video-id');
      this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      this.removeEventListener('error', maxresFallback);
      this.addEventListener('error', function hqFallback() {
        this.closest('.video-thumb').classList.add('thumb-fallback');
        this.style.display = 'none';
        this.removeEventListener('error', hqFallback);
      }, { once: true });
    }, { once: true });
  });

  document.querySelectorAll('.video-thumb[data-video-id]').forEach((thumb) => {
    thumb.addEventListener('click', function activate() {
      const videoId = this.getAttribute('data-video-id');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = this.getAttribute('data-title') || 'Showreel video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      this.innerHTML = '';
      this.appendChild(iframe);
      this.removeEventListener('click', activate);
      this.style.cursor = 'default';
    });

    // keyboard accessibility
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

});
