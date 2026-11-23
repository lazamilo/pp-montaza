(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) html.classList.add('reduce');
  const hasG = !!window.gsap;
  if (hasG) gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  let lenis;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasG) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href')); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -100 });
    }));
    if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); t && lenis.scrollTo(t, { offset: -100, immediate: true }); }, 60);
  }

  /* header */
  const hdr = document.getElementById('hdr');
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('solid', y > 20);
    const megaOpen = document.querySelector('.has-mega.open');
    hdr.classList.toggle('hide', y > 400 && y > last && !megaOpen && !html.classList.contains('menu-open'));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mega menu */
  const hm = document.querySelector('.has-mega');
  if (hm) {
    const btn = hm.querySelector('button');
    let tm, hoverAt = 0;
    const open = v => { hm.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); if (v) hdr.classList.add('solid'); else onScroll(); };
    hm.addEventListener('mouseenter', () => { clearTimeout(tm); hoverAt = Date.now(); open(true); });
    hm.addEventListener('mouseleave', () => { tm = setTimeout(() => open(false), 160); });
    btn.addEventListener('click', () => { if (Date.now() - hoverAt < 600) return; open(!hm.classList.contains('open')); });
    document.addEventListener('click', e => { if (!hm.contains(e.target)) open(false); });
    addEventListener('keydown', e => e.key === 'Escape' && open(false));
  }
  /* mobile menu */
  document.querySelector('.burger')?.addEventListener('click', () => { html.classList.toggle('menu-open'); hdr.classList.add('solid'); });
  document.querySelectorAll('.mnav a').forEach(a => a.addEventListener('click', () => html.classList.remove('menu-open')));

  /* split headlines into masked words */
  document.querySelectorAll('.split').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="line-word"><span>${w}</span></span>`).join(' ');
  });
  document.querySelectorAll('.fill').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });

  /* map */
  const mapEl = document.getElementById('map');
  if (mapEl && window.MAP) {
    const M = window.MAP, NS = 'http://www.w3.org/2000/svg';
    const [hn, hx, hy] = M.home;
    const sites = M.cities.filter(c => !/Borealis|Vienna/.test(c[0]));
    let s = `<svg viewBox="40 20 940 940" role="img" aria-label="Map of P&P Montaža project sites in Europe"><g>`;
    M.dots.forEach(([x, y]) => { s += `<circle class="dot" cx="${x}" cy="${y}" r="4.2"/>`; });
    s += `</g><g class="arcs">`;
    sites.forEach(([n, x, y]) => {
      const mx = (hx + x) / 2, my = (hy + y) / 2 - Math.hypot(x - hx, y - hy) * 0.35;
      s += `<path class="arc" d="M${hx} ${hy} Q${mx} ${my} ${x} ${y}"/>`;
    });
    s += `</g><g class="sites">`;
    sites.forEach(([n, x, y]) => {
      s += `<g class="st" transform="translate(${x} ${y})"><circle class="ring" r="12"/><circle class="site" r="5.5"/></g>`;
    });
    s += `</g><g transform="translate(${hx} ${hy})"><circle class="ring" r="20"/><circle class="home" r="9"/></g>`;
    const at = re => sites.find(c => re.test(c[0]));
    const lbl = (t, c, dx, dy, anchor = 'start') => `<text x="${c[1] + dx}" y="${c[2] + dy}" text-anchor="${anchor}">${t}</text>`;
    s += `<g class="labels">`
      + `<text x="${hx + 30}" y="${hy + 8}" style="font-size:22px;font-weight:700">Slovenska Bistrica</text>`
      + lbl('Göteborg', at(/Göteborg/), 20, 6)
      + lbl('Leipzig', at(/Leipzig/), 20, 6)
      + lbl('Ludwigshafen', at(/BASF/), -20, -8, 'end')
      + lbl('Sindelfingen', at(/Mercedes/), -20, 14, 'end')
      + lbl('Ingolstadt', at(/Audi/), 0, -22, 'middle')
      + lbl('Burghausen', at(/Burghausen/), -14, 36, 'end')
      + lbl('Linz', at(/voest/), 0, -22, 'middle')
      + lbl('Vienna', at(/OMV/), 20, -14)
      + `</g></svg>`;
    mapEl.innerHTML = s;
  }

  const done = () => html.classList.add('loaded');

  if (!hasG || reduce) {
    done();
    document.querySelectorAll('.fill .w').forEach(w => w.style.color = 'inherit');
    document.querySelectorAll('.count').forEach(c => c.textContent = c.dataset.to);
    return;
  }

  /* ---- motion ---- */
  const intro = () => {
    const h1 = document.querySelector('main h1.split');
    if (h1) gsap.from(h1.querySelectorAll('.line-word>span'), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .06 });
    gsap.from('.hdr', { y: -30, opacity: 0, duration: 1, ease: 'expo.out' });
    gsap.from('.strip figure', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut', stagger: .09, delay: .25 });
  };

  const loader = document.querySelector('.loader');
  const seen = sessionStorageGet();
  if (loader && document.body.dataset.page === 'home' && !seen) {
    const tl = gsap.timeline({ onComplete: () => { done(); intro(); } });
    tl.to('.loader .lg', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' })
      .to('.loader .bar', { width: '100%', duration: .9, ease: 'power2.inOut' }, 0.15)
      .to('.loader', { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '+=.15');
    try { sessionStorage.setItem('ppm-seen', '1'); } catch (e) {}
  } else { done(); intro(); }
  function sessionStorageGet() { try { return sessionStorage.getItem('ppm-seen'); } catch (e) { return null; } }

  // headline word reveals (except the hero h1)
  document.querySelectorAll('.split').forEach(el => {
    if (el.matches('main h1')) return;
    gsap.from(el.querySelectorAll('.line-word>span'), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  // generic reveals
  ScrollTrigger.batch('.rv', { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }) });

  // pipe line draws on scroll
  document.querySelectorAll('.pipe .run').forEach(p => {
    const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 40%', scrub: .6 } });
    gsap.to(p, { strokeDashoffset: L * .78, duration: 1.6, ease: 'expo.out', delay: .6 });
  });

  // image parallax inside frames
  document.querySelectorAll('.strip figure img, .people figure img, .wide-img img').forEach(img => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // statement fill
  document.querySelectorAll('.fill').forEach(el => {
    gsap.to(el.querySelectorAll('.w'), { color: '#0b1626', stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
  });

  // counters
  document.querySelectorAll('.count').forEach(c => {
    const o = { v: 0 };
    gsap.to(o, { v: +c.dataset.to, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' }, onUpdate: () => c.textContent = Math.round(o.v) });
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    // stacked cards: earlier cards shrink and dim as the next one arrives
    const cards = gsap.utils.toArray('.stack .card');
    cards.forEach((c, i) => {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .94, filter: 'brightness(.82)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top+=120', scrub: true } });
    });
    // accommodation horizontal drift
    const tr = document.querySelector('.hs-track');
    if (tr) gsap.fromTo(tr, { x: 0 }, { x: () => -(tr.scrollWidth - innerWidth) * .6, ease: 'none', scrollTrigger: { trigger: '.hscroll', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });

  // pillars rail
  const rail = document.querySelector('.pillars .rail i');
  if (rail) gsap.to(rail, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.pillars', start: 'top 80%', end: 'bottom 60%', scrub: true } });
  document.querySelectorAll('.pillar .node').forEach((n, i) => gsap.from(n, { scale: 0, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: n, start: 'top 75%' } }));

  // map arcs
  if (mapEl) {
    const arcs = mapEl.querySelectorAll('.arc');
    arcs.forEach(a => { const L = a.getTotalLength(); a.style.strokeDasharray = L; a.style.strokeDashoffset = L; });
    const tl = gsap.timeline({ scrollTrigger: { trigger: mapEl, start: 'top 70%' } });
    tl.from(mapEl.querySelectorAll('.dot'), { opacity: 0, duration: .8, stagger: { amount: .8, from: 'center' } })
      .to(arcs, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: .08 }, .4)
      .from(mapEl.querySelectorAll('.st'), { scale: 0, transformOrigin: 'center', duration: .6, ease: 'back.out(3)', stagger: .08 }, 1.2)
      .from(mapEl.querySelectorAll('.labels text'), { opacity: 0, y: 8, duration: .6, stagger: .06 }, 1.6);
    gsap.to(mapEl.querySelectorAll('.ring'), { scale: 1.5, opacity: 0, transformOrigin: 'center', duration: 1.8, repeat: -1, ease: 'power1.out', stagger: .2 });
  }

  // services side nav
  const side = document.querySelectorAll('.svc-side a');
  side.forEach(a => {
    const t = document.querySelector(a.getAttribute('href'));
    t && ScrollTrigger.create({ trigger: t, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && side.forEach(x => x.classList.toggle('on', x === a)) });
  });

  // cta
  gsap.from('.cta-pipe path', { opacity: 0, x: 60, duration: 1.5, scrollTrigger: { trigger: '.cta', start: 'top 70%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
