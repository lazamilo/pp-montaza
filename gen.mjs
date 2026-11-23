// Builds the static pages into site/ from shared header, mega menu and footer.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'site');
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });

const ARR = `<svg class="arr" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 9h13M10 4l5 5-5 5"/></svg>`;

// Animated planetary cutting illustration (no photo of their saw survived on the site).
const CUT_SVG = `<svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-label="Planetary cutting diagram">
  <rect width="600" height="450" fill="#e6ebf1"/>
  <g stroke="#c9d2dc" stroke-width="1">${Array.from({length:13},(_,i)=>`<line x1="${i*50}" y1="0" x2="${i*50}" y2="450"/>`).join('')}${Array.from({length:10},(_,i)=>`<line x1="0" y1="${i*50}" x2="600" y2="${i*50}"/>`).join('')}</g>
  <circle cx="300" cy="225" r="118" fill="#fff" stroke="#0b1626" stroke-width="3"/>
  <circle cx="300" cy="225" r="92" fill="#e6ebf1" stroke="#0b1626" stroke-width="3"/>
  <circle cx="300" cy="225" r="150" fill="none" stroke="#1660c9" stroke-width="1.5" stroke-dasharray="4 8"/>
  <g class="orbit" style="transform-origin:300px 225px;animation:orbit 7s linear infinite">
    <g transform="translate(300 75)">
      <g style="animation:spin 1.2s linear infinite;transform-origin:0 0">
        <circle r="46" fill="#1660c9"/>
        ${Array.from({length:18},(_,i)=>`<path d="M0 -46 L5 -54 L9 -45" fill="#1660c9" transform="rotate(${i*20})"/>`).join('')}
        <circle r="10" fill="#fff"/>
      </g>
    </g>
  </g>
  <g font-family="Supreme,sans-serif" font-size="15" font-weight="500" fill="#3d4a5c">
    <text x="36" y="410">Pipe stays clamped, without deformation</text>
    <text x="400" y="410">Blade orbits the pipe</text>
  </g>
  <style>@keyframes orbit{to{transform:rotate(360deg)}}@keyframes spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.orbit,.orbit *{animation:none!important}}</style>
</svg>`;

const SERVICES = [
  { id: 'industrial-installations', t: 'Industrial installations', s: 'Steel structures, pipelines, sanitary and electrical', img: 'installations.jpg',
    lead: 'Installation of steel structures, pipelines, sanitary and electrical installations. We also dismantle, service and maintain industrial equipment and installations.',
    specs: [['Scope', 'Trained crews to complete projects'], ['Sectors', 'Automotive, paper, refinery, gas, chemical'], ['Also', 'Dismantling, service, maintenance']],
    body: ['Our services range from providing trained personnel to delivering complete projects, including engineering and production with certified partner companies where needed.', 'Among our customers are companies from the automotive, paper, refinery, gas and chemical industries, including OMV, Mercedes-Benz, Audi, voestalpine Linz, Borealis and ArcelorMittal.'] },
  { id: 'orbital-welding', t: 'Orbital welding', s: 'Automated TIG welding, 100% repeatable', img: 'welding.jpg', dark: true,
    lead: 'Orbital welding is an automated arc welding process that joins two pipes in a butt joint. Every weld is repeatable and reliable.',
    specs: [['Process', 'TIG'], ['Pipes', 'Various diameters and wall thicknesses'], ['Used in', 'Energy to food industry']],
    body: ['Pipe welding requires constant control of the weld pool, its volume and its behaviour. The technology is used mostly for industrial pipelines, from energy to the food industry.', 'Because the process is automatic, orbital welds are 100% repeatable and reliable. We weld in TIG technology on pipes of different diameters and wall thicknesses.'] },
  { id: 'orbital-cutting', t: 'Orbital cutting', s: 'Precise, square, burr-free pipe ends', svg: CUT_SVG,
    lead: 'A precise, square, burr-free cut and a perfectly bevelled pipe end. The basic requirement for productive, high quality automated welding.',
    specs: [['Method', 'Planetary cutting'], ['Equipment', 'Orbitalum pipe saws'], ['Materials', 'Stainless, low and unalloyed steel, plastics, cast, non-ferrous']],
    body: ['Orbitalum pipe saws cut and bevel high alloy stainless steel, low alloy and unalloyed steel, plastics, cast materials and non-ferrous metals in seconds, using the planetary cutting method.', 'The clamping is powerful and leaves the workpiece without any deformation.'] },
  { id: 'pipe-bending', t: 'CNC pipe bending', s: 'Metal pipes up to Ø 42 mm', img: 'bending.jpg',
    lead: 'With our CNC bending machine we bend all kinds of metal pipes, with walls up to 2 mm and diameters up to 42 mm.',
    specs: [['Wall thickness', 'up to 2 mm'], ['Diameter', 'up to 42 mm'], ['Materials', 'All kinds of metal pipe']],
    body: ['CNC control keeps every bend identical, from a single prototype to a full series of pipe assemblies.', 'Bending in house means shorter routes, fewer welds and faster installation on site.'] },
  { id: 'manufacturing', t: 'Manufacturing', s: 'Industrial equipment and components', img: 'manufacturing.jpg',
    lead: 'We manufacture all kinds of industrial assemblies, using a range of machining techniques for materials and components.',
    specs: [['Output', 'Assemblies, skids, components'], ['Processes', 'Machining, welding, bending'], ['Partners', 'Certified production partners']],
    body: ['From individual parts to complete process skids, we build equipment that arrives ready to install.', 'Production and installation from one team means one point of responsibility, from the workshop to commissioning.'] },
  { id: 'pipe-constructions', t: 'Pipe constructions', s: 'Aluminium, stainless and steel', img: 'constructions.jpg',
    lead: 'We make all kinds of pipe constructions from aluminium, stainless (inox) and steel pipes and profiles.',
    specs: [['Materials', 'Aluminium, inox, steel'], ['Forms', 'Pipes and profiles'], ['Use', 'Frames, racks, constructions']],
    body: ['Frames, supports, racks and custom constructions, cut, bent and welded to drawing.', 'Combined with orbital welding and CNC bending, we deliver complete pipe assemblies ready for installation.'] },
];

const thumb = (s) => s.img ? `<img src="assets/img/${s.img}" alt="${s.t}" loading="lazy">` : s.svg;

const header = (active) => `
<div class="loader" aria-hidden="true"><img class="lg" src="assets/img/logo.png" alt=""><i class="bar"></i></div>
<header class="hdr" id="hdr">
  <a class="logo" href="index.html" aria-label="P&P Montaža home"><img src="assets/img/logo.png" alt="P&P Montaža"></a>
  <nav class="nav" aria-label="Main">
    <a href="about.html"${active==='about'?' class="on"':''}>About</a>
    <div class="has-mega">
      <button aria-expanded="false" aria-haspopup="true">Services <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 1.5l5 5 5-5"/></svg></button>
      <div class="mega" role="menu">
        <div class="mega-intro">
          <div class="d3">Everything a plant runs on.</div>
          <p>From one component to a complete system, installed by our own trained crews.</p>
          <a class="tlink" href="services.html">All services ${ARR}</a>
        </div>
        <div class="mega-grid">
          ${SERVICES.map(s => `<a class="mega-card" href="services.html#${s.id}"><div class="th">${thumb(s)}</div><div><b>${s.t}</b><small>${s.s}</small></div></a>`).join('')}
        </div>
      </div>
    </div>
    <a href="references.html"${active==='references'?' class="on"':''}>References</a>
    <a href="accommodation.html"${active==='accommodation'?' class="on"':''}>Accommodation</a>
    <a href="contact.html"${active==='contact'?' class="on"':''}>Contact</a>
  </nav>
  <a class="btn" href="contact.html">Start a project ${ARR}</a>
  <button class="burger" aria-label="Menu"><span></span><span></span></button>
</header>
<div class="mnav">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="services.html">Services</a>
  <div class="sub">${SERVICES.map(s => `<a href="services.html#${s.id}">${s.t}</a>`).join('')}</div>
  <a href="references.html">References</a>
  <a href="accommodation.html">Accommodation</a>
  <a href="contact.html">Contact</a>
  <a class="btn" href="contact.html">Start a project ${ARR}</a>
</div>`;

const CTA_PIPE = `<svg class="cta-pipe" viewBox="0 0 400 800" aria-hidden="true"><path d="M380 0v180a40 40 0 0 1-40 40H160a40 40 0 0 0-40 40v160a40 40 0 0 0 40 40h120a40 40 0 0 1 40 40v290"/><path d="M340 0v160a20 20 0 0 1-20 20H140a80 80 0 0 0-80 80v160a80 80 0 0 0 80 80h100a40 40 0 0 1 40 40v260" opacity=".6"/></svg>`;

const footer = `
<section class="cta sec wrap">
  ${CTA_PIPE}
  <div class="inner cta-row">
    <div>
      <h2 class="d1 split">Let's build your next installation.</h2>
      <p class="lead">Tell us about the plant, the scope and the timeline. We reply with crews, schedule and an offer.</p>
      <a class="btn" href="contact.html">Start a project ${ARR}</a>
    </div>
    <div class="cta-contacts">
      <a href="mailto:edvard@pp-montaza.si">edvard@pp-montaza.si</a>
      <a href="tel:+38641692782">+386 41 692 782</a>
      <a href="tel:+38628036943">+386 2 80 36 943</a>
    </div>
  </div>
</section>
<footer class="ftr">
  <div class="ftr-grid">
    <div>
      <a class="logo" href="index.html"><img src="assets/img/logo.png" alt="P&P Montaža"></a>
      <p class="addr">P&P Montaža d.o.o.<br>Štancerjeva ulica 1<br>SI 2310 Slovenska Bistrica, Slovenia</p>
    </div>
    <div><h5>Services</h5><ul>${SERVICES.map(s => `<li><a href="services.html#${s.id}">${s.t}</a></li>`).join('')}</ul></div>
    <div><h5>Company</h5><ul><li><a href="about.html">About</a></li><li><a href="references.html">References</a></li><li><a href="accommodation.html">Accommodation</a></li><li><a href="contact.html">Contact</a></li></ul></div>
    <div><h5>Contact</h5><ul><li><a href="tel:+38641692782">+386 41 692 782</a></li><li><a href="tel:+38628036943">+386 2 80 36 943</a></li><li><a href="mailto:edvard@pp-montaza.si">edvard@pp-montaza.si</a></li><li><a href="https://maps.google.com/?q=Štancerjeva+ulica+1,+2310+Slovenska+Bistrica" target="_blank" rel="noopener">Directions</a></li></ul></div>
  </div>
  <div class="ftr-btm"><span>© 2026 P&P Montaža d.o.o.</span><span>Impressum · Legal notice · Cookies</span><span>English · Slovenščina · Deutsch</span></div>
</footer>`;

const page = (file, title, active, body, extraJs = '') => {
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="P&P Montaža: industrial installations, orbital welding and cutting, CNC pipe bending and manufacturing across Europe since 2012.">
<meta name="robots" content="noindex">
<link rel="icon" href="assets/img/logo.png">
<link rel="preload" href="assets/fonts/Supreme-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
<script>document.documentElement.classList.remove('no-js')</script>
<script>
(function () {
  if (!/[?&]r=/.test(location.search)) return;
  var s = document.createElement('script');
  s.async = true;
  s.referrerPolicy = 'no-referrer';
  s.setAttribute('data-landing', location.href);
  s.src = 'https://phplaravel-758037-6569212.cloudwaysapps.com/v/script.js';
  document.head.appendChild(s);
})();
</script>
</head>
<body data-page="${active}">
${header(active)}
<main>
${body}
</main>
${active === 'contact' ? footer.replace(/<section class="cta[\s\S]*?<\/section>/, '') : footer}
<script src="assets/js/gsap.min.js"></script>
<script src="assets/js/ScrollTrigger.min.js"></script>
<script src="assets/js/lenis.min.js"></script>
${extraJs}
<script src="assets/js/site.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(out, file), html);
};

/* ---------- HOME ---------- */
const PIPE = `<svg class="pipe" viewBox="0 0 1600 150" preserveAspectRatio="none" aria-hidden="true">
  <path class="ghost" d="M0 110 H360 a30 30 0 0 0 30 -30 V60 a30 30 0 0 1 30 -30 H760 a30 30 0 0 1 30 30 V90 a30 30 0 0 0 30 30 H1180 a30 30 0 0 0 30 -30 V70 a30 30 0 0 1 30 -30 H1600"/>
  <path class="run" d="M0 110 H360 a30 30 0 0 0 30 -30 V60 a30 30 0 0 1 30 -30 H760 a30 30 0 0 1 30 30 V90 a30 30 0 0 0 30 30 H1180 a30 30 0 0 0 30 -30 V70 a30 30 0 0 1 30 -30 H1600"/>
</svg>`;

const home = `
<section class="hero wrap">
  <div class="hero-top">
    <h1 class="d1 split">From a single pipe to a complete plant.</h1>
    <div class="hero-sub">
      <p class="lead rv">P&P Montaža installs steel structures, pipelines, sanitary and electrical systems for industry across Europe. Since 2012.</p>
      <div class="hero-ctas rv"><a class="btn" href="contact.html">Start a project ${ARR}</a><a class="btn ghost" href="services.html">Our services</a></div>
    </div>
  </div>
  ${PIPE}
  <div class="strip">
    <figure><img src="assets/img/installations.jpg" alt="Industrial pipe installation with valve actuators"><figcaption>Industrial installations</figcaption></figure>
    <figure><img src="assets/img/welding.jpg" alt="Orbital welding head on a stainless pipe"><figcaption>Orbital welding</figcaption></figure>
    <figure><img src="assets/img/manufacturing.jpg" alt="Stainless process skid built by P&P Montaža"><figcaption>Manufacturing</figcaption></figure>
    <figure><img src="assets/img/constructions.jpg" alt="Bent stainless pipe assemblies"><figcaption>Pipe constructions</figcaption></figure>
  </div>
</section>

<section class="sec wrap statement">
  <h2 class="d2 fill">We run the entire project, from producing individual components to installing complete systems.</h2>
  <div class="facts">
    <div class="fact rv"><b><span class="count" data-to="50">0</span>+</b><span>facilities completed across Europe</span></div>
    <div class="fact rv"><b>2012</b><span>founded in Slovenska Bistrica, Slovenia</span></div>
    <div class="fact rv"><b><span class="count" data-to="100">0</span>%</b><span>repeatable orbital welds in TIG technology</span></div>
    <div class="fact rv"><b>Ø <span class="count" data-to="42">0</span></b><span>mm pipe diameter on our CNC bender</span></div>
  </div>
</section>

<section class="wrap" id="services">
  <div class="svc-head">
    <h2 class="d2 split">A wide range of services.</h2>
    <p class="lead rv">Six disciplines under one roof, so one team carries your project from the workshop to commissioning.</p>
  </div>
  <div class="stack">
    ${SERVICES.map(s => `
    <article class="card${s.dark ? ' dark' : ''}">
      <div class="card-txt">
        <div>
          <h3 class="d3">${s.t}</h3>
          <p class="lead">${s.lead}</p>
          <a class="tlink" href="services.html#${s.id}">Learn more ${ARR}</a>
        </div>
        <ul class="specs">${s.specs.map(([k, v]) => `<li>${k}<span>${v}</span></li>`).join('')}</ul>
      </div>
      <div class="card-media">${thumb(s)}</div>
    </article>`).join('')}
  </div>
</section>

<section class="sec wrap">
  <h2 class="d2 split" style="max-width:18ch">Production, performance and engineering in one line.</h2>
  <div class="pillars">
    <div class="rail"><i></i></div>
    <div class="pillar rv"><i class="node"></i><h3 class="h4">Production</h3><p>We run the entire project, from producing the individual pieces and components to installing complete systems.</p></div>
    <div class="pillar rv"><i class="node"></i><h3 class="h4">Performance</h3><p>Our competences cover all kinds of installations, from mechanical to electrical, including maintenance and service.</p></div>
    <div class="pillar rv"><i class="node"></i><h3 class="h4">Engineering</h3><p>Together with partner companies we deliver complete engineering and project management.</p></div>
  </div>
</section>

<section class="sec wrap mapsec">
  <div class="map-grid">
    <div>
      <h2 class="d2 split">More than 50 facilities across Europe.</h2>
      <p class="lead rv">Reliable crews of many profiles, trusted on the most demanding projects. From automotive and paper to refinery, gas and chemical plants.</p>
      <ul class="reflist">
        ${['Mercedes-Benz', 'Audi Ingolstadt', 'BMW Leipzig', 'voestalpine Stahl', 'Borealis', 'BASF', 'OMV', 'RAG AG', 'Burghausen', 'Göteborg Energi', 'JCH Christoph', 'Kaufland'].map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
    <div class="map" id="map"></div>
  </div>
</section>

<div class="logos" aria-label="Clients">
  <div class="logos-track">
    ${[0, 1].map(() => ['mercedes', 'audi', 'omv', 'borealis', 'voestalpine', 'arcelormittal'].map(l => `<img src="assets/img/logos/${l}.png" alt="${l}">`).join('')).join('')}
  </div>
</div>

<section class="sec wrap people">
  <figure><img src="assets/img/edvard.jpg" alt="Edvard Pivec, CEO of P&P Montaža"></figure>
  <div>
    <h2 class="d2 split">Qualified people, trained on every job.</h2>
    <p class="lead rv">Our staff are regularly trained in theory and in practice. That means command of current technologies and methods, combined with years of experience across Europe, and fluent communication on every site abroad.</p>
    <div class="sig rv">
      <div><b>Edvard Pivec</b><span>CEO</span></div>
      <div><b><a href="tel:+38641692782">+386 41 692 782</a></b><span>Direct line</span></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap acc-head">
    <div>
      <h2 class="d2 split">A place to stay for your crew.</h2>
      <p class="lead rv">Accommodation for groups of workers or individuals, close to the centre of Slovenska Bistrica.</p>
    </div>
    <a class="btn ghost rv" href="accommodation.html">See the rooms ${ARR}</a>
  </div>
  <div class="hscroll"><div class="hs-track">
    ${['Soba1', 'Jedilnica', 'Soba3', 'Kopalnica1', 'Soba5', 'Pralnica', 'Soba8', 'Hodnik'].map(r => `<figure><img src="assets/img/rooms/${r}.jpg" alt="Accommodation room" loading="lazy"></figure>`).join('')}
  </div></div>
  <div class="wrap price rv">
    <div><b>15</b><span>beds in single and double rooms</span></div>
    <div><b>15 €</b><span>per night, from</span></div>
    <div><b>Wi-Fi</b><span>kitchen, laundry, meals nearby</span></div>
  </div>
</section>`;
page('index.html', 'P&P Montaža · Industrial installations across Europe', 'home', home, '<script src="assets/js/map.js"></script>');

/* ---------- SERVICES ---------- */
const services = `
<section class="phero wrap">
  <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>Services</span></div>
  <h1 class="d1 split">Professional industrial services.</h1>
  <p class="lead rv">From providing trained personnel to delivering complete projects, including engineering and production with certified partner companies where needed.</p>
</section>
<section class="wrap svc-page">
  <ul class="svc-side">${SERVICES.map(s => `<li><a href="#${s.id}">${s.t}</a></li>`).join('')}</ul>
  <div>
    ${SERVICES.map(s => `
    <article class="svc-block" id="${s.id}">
      <h2 class="d2">${s.t}</h2>
      <p class="lead" style="margin-top:24px;max-width:46ch">${s.lead}</p>
      <div class="media">${s.img ? `<img src="assets/img/${s.img}" alt="${s.t}" loading="lazy">` : s.svg}</div>
      <div class="svc-cols">
        <div>${s.body.map(p => `<p>${p}</p>`).join('')}</div>
        <ul class="specs">${s.specs.map(([k, v]) => `<li>${k}<span>${v}</span></li>`).join('')}</ul>
      </div>
    </article>`).join('')}
  </div>
</section>`;
page('services.html', 'Services · P&P Montaža', 'services', services);

/* ---------- ABOUT ---------- */
const ICONS = {
  car: '<path d="M5 26h32M8 26l3-9h20l3 9M9 26v5h5v-5M28 26v5h5v-5"/><circle cx="12" cy="22" r="1.5"/><circle cx="30" cy="22" r="1.5"/>',
  paper: '<path d="M8 8h18l8 8v18H8z"/><path d="M26 8v8h8M13 22h16M13 27h16"/>',
  refinery: '<path d="M7 35V16h6v19M17 35V8h6v27M27 35V20h8v15M4 35h34"/><path d="M20 8c0-3 3-3 3-6"/>',
  gas: '<path d="M21 4c6 8 10 12 10 19a10 10 0 0 1-20 0c0-4 2-7 4-9 1 4 3 5 4 5 0-5-1-9 2-15z"/>',
  chem: '<path d="M16 5h10M18 5v11L8 33a3 3 0 0 0 3 4h20a3 3 0 0 0 3-4L24 16V5"/><path d="M12 27h18"/>',
};
const about = `
<section class="phero wrap">
  <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>About</span></div>
  <h1 class="d1 split">Assembly for industry, since 2012.</h1>
  <p class="lead rv">P&P Montaža d.o.o. was founded in 2012 and specialises in all types of assembly in industrial environments.</p>
</section>
<section class="wrap"><div class="wide-img"><img src="assets/img/installations.jpg" alt="Pipe installation by P&P Montaža"></div></section>
<section class="sec wrap about-grid">
  <div><h2 class="d3 split">What we do.</h2></div>
  <div class="lead">
    <p>This includes the installation of steel structures, various pipelines, sanitary and electrical installations. As part of our services we also dismantle, service and maintain industrial equipment and installations.</p>
    <p>We provide everything from trained personnel to the delivery of complete projects, including engineering and production with certified partner companies where needed.</p>
  </div>
</section>
<section class="wrap" style="padding-bottom:clamp(96px,12vw,220px)">
  <h2 class="d3 split" style="max-width:20ch">Trusted across five industries.</h2>
  <div class="ind">
    ${[['car', 'Automotive'], ['paper', 'Paper'], ['refinery', 'Refinery'], ['gas', 'Gas'], ['chem', 'Chemical']].map(([i, t]) => `<div class="rv"><svg viewBox="0 0 42 42">${ICONS[i]}</svg><b>${t}</b></div>`).join('')}
  </div>
</section>
<section class="sec wrap people mapsec" style="background:var(--steel)">
  <figure><img src="assets/img/edvard.jpg" alt="Edvard Pivec, CEO"></figure>
  <div>
    <h2 class="d2 split">Employees.</h2>
    <p class="lead rv">Our staff have excellent qualifications and are regularly trained in theory and in practice. This ensures command of cutting edge technologies and working methods, combined with years of experience in Europe. We also provide fluent communication at individual facilities abroad.</p>
  </div>
</section>
<section class="sec wrap about-grid">
  <div><h2 class="d3 split">Company details.</h2></div>
  <ul class="kv">
    <li><span>Company</span>P&P Montaža d.o.o.</li>
    <li><span>Address</span>Štancerjeva ulica 1, 2310 Slovenska Bistrica, Slovenia, EU</li>
    <li><span>CEO</span>Edvard Pivec</li>
    <li><span>Phone</span><a href="tel:+38628036943">+386 2 80 36 943</a></li>
    <li><span>Mobile</span><a href="tel:+38641692782">+386 41 692 782</a></li>
    <li><span>Email</span><a href="mailto:edvard@pp-montaza.si">edvard@pp-montaza.si</a></li>
  </ul>
</section>`;
page('about.html', 'About · P&P Montaža', 'about', about);

/* ---------- REFERENCES ---------- */
const REFS = [['Mercedes-Benz', 'Automotive · Germany'], ['Audi Ingolstadt', 'Automotive · Germany'], ['BMW Leipzig', 'Automotive · Germany'], ['voestalpine Stahl GmbH', 'Steel · Austria'], ['Borealis', 'Chemical · Austria'], ['BASF', 'Chemical · Germany'], ['OMV', 'Refinery and gas · Austria'], ['RAG AG', 'Gas storage · Austria'], ['Burghausen', 'Chemical · Germany'], ['Göteborg Energi', 'Energy · Sweden'], ['JCH Christoph', 'Industrial · Germany'], ['Kaufland', 'Retail · Germany'], ['ArcelorMittal', 'Steel · Europe']];
const refs = `
<section class="phero wrap">
  <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>References</span></div>
  <h1 class="d1 split">Trusted by Europe's industry.</h1>
  <p class="lead rv">Since 2012 we have completed work at more than 50 facilities across Europe. A selection of the companies we have worked for.</p>
</section>
<section class="wrap"><ul class="ref-big">${REFS.map(([n, d]) => `<li class="rv"><b>${n}</b><span>${d}</span></li>`).join('')}</ul></section>
<div class="logos" style="margin-top:clamp(80px,8vw,140px)"><div class="logos-track">${[0, 1].map(() => ['mercedes', 'audi', 'omv', 'borealis', 'voestalpine', 'arcelormittal'].map(l => `<img src="assets/img/logos/${l}.png" alt="${l}">`).join('')).join('')}</div></div>
<section class="sec wrap mapsec" style="background:#fff">
  <div class="map-grid">
    <div><h2 class="d2 split">Wherever the plant is.</h2><p class="lead rv">Our crews travel with tools, qualifications and the language skills to work fluently on site, from Sweden to Austria.</p></div>
    <div class="map" id="map"></div>
  </div>
</section>`;
page('references.html', 'References · P&P Montaža', 'references', refs, '<script src="assets/js/map.js"></script>');

/* ---------- ACCOMMODATION ---------- */
const AM = {
  bed: '<path d="M3 28V10M3 22h30v6M33 22v-4a4 4 0 0 0-4-4H15v8"/><circle cx="9" cy="17" r="3"/>',
  wifi: '<path d="M4 14a20 20 0 0 1 28 0M9 19a13 13 0 0 1 18 0M14 24a6 6 0 0 1 8 0"/><circle cx="18" cy="29" r="1.6"/>',
  wash: '<rect x="6" y="4" width="24" height="28" rx="2"/><circle cx="18" cy="20" r="7"/><path d="M6 10h24"/>',
  meal: '<path d="M10 4v28M6 4v8a4 4 0 0 0 8 0V4M26 32V4c-4 2-5 8-5 14h5"/>',
};
const rooms = ['Soba1', 'Soba2', 'Jedilnica', 'Soba3', 'Soba4', 'Kopalnica1', 'Soba5', 'Soba6', 'Pralnica', 'Soba8', 'Kopalnica2', 'Soba10', 'Hodnik'];
const cls = ['a', 'b', 'b', 'a', 'c', 'c', 'c', 'a', 'b', 'b', 'a', 'c', 'c'];
const acc = `
<section class="phero wrap">
  <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>Accommodation</span></div>
  <h1 class="d1 split">Accommodation for workers.</h1>
  <p class="lead rv">Close to the centre of Slovenska Bistrica we offer accommodation for groups of workers or individuals. 15 beds in single or double rooms, from 15 € per night.</p>
</section>
<section class="wrap"><div class="gal">${rooms.map((r, i) => `<figure class="${cls[i]} rv"><img src="assets/img/rooms/${r}.jpg" alt="Accommodation" loading="lazy"></figure>`).join('')}</div>
  <div class="amen">
    <div class="rv"><svg viewBox="0 0 36 36">${AM.bed}</svg><b>15 beds</b><span>Single and double rooms</span></div>
    <div class="rv"><svg viewBox="0 0 36 36">${AM.wifi}</svg><b>Free Wi-Fi</b><span>Throughout the house</span></div>
    <div class="rv"><svg viewBox="0 0 36 36">${AM.wash}</svg><b>Washing machine</b><span>Shared kitchen and bathrooms</span></div>
    <div class="rv"><svg viewBox="0 0 36 36">${AM.meal}</svg><b>Meals nearby</b><span>Breakfast and meals at the restaurant next door</span></div>
  </div>
</section>
<section class="sec wrap form-grid">
  <div><h2 class="d2 split">Check availability.</h2><p class="lead rv" style="margin-top:24px">Call for an offer and availability, or send your dates and group size.</p><p class="lead" style="margin-top:24px"><a class="tlink" href="tel:+38641692782">+386 41 692 782</a></p></div>
  <form class="f" onsubmit="event.preventDefault();this.classList.add('sent')">
    <label>Your name<input required></label>
    <label>Your email<input type="email" required></label>
    <label>Arrival<input type="date"></label>
    <label>Guests<input type="number" min="1" max="15" value="4"></label>
    <label class="full">Message<textarea></textarea></label>
    <button class="btn" type="submit">Send request ${ARR}</button>
    <div class="f-ok">Thank you. We will get back to you shortly.</div>
  </form>
</section>`;
page('accommodation.html', 'Accommodation · P&P Montaža', 'accommodation', acc);

/* ---------- CONTACT ---------- */
const contact = `
<section class="phero wrap">
  <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>Contact</span></div>
  <h1 class="d1 split">Tell us about your project.</h1>
  <p class="lead rv">Do you need more information about our services? Send a few details and we will reply with crews, schedule and an offer.</p>
</section>
<section class="wrap form-grid" style="padding-bottom:clamp(96px,12vw,220px)">
  <ul class="kv">
    <li><span>Email</span><a href="mailto:edvard@pp-montaza.si">edvard@pp-montaza.si</a></li>
    <li><span>Mobile</span><a href="tel:+38641692782">+386 41 692 782</a></li>
    <li><span>Phone</span><a href="tel:+38628036943">+386 2 80 36 943</a></li>
    <li><span>Address</span>Štancerjeva ulica 1<br>2310 Slovenska Bistrica, Slovenia</li>
    <li><span>CEO</span>Edvard Pivec</li>
  </ul>
  <form class="f" onsubmit="event.preventDefault();this.classList.add('sent')">
    <div class="full"><label style="margin-bottom:10px">What do you need?</label>
      <div class="chips">${SERVICES.map(s => `<label><input type="checkbox"><span>${s.t}</span></label>`).join('')}<label><input type="checkbox"><span>Accommodation</span></label></div>
    </div>
    <label>Your name<input required></label>
    <label>Company<input></label>
    <label>Email<input type="email" required></label>
    <label>Phone<input type="tel"></label>
    <label class="full">Project location and timeline<input placeholder="e.g. Linz, Q2 2027"></label>
    <label class="full">Message<textarea></textarea></label>
    <button class="btn" type="submit">Send inquiry ${ARR}</button>
    <div class="f-ok">Thank you. We will get back to you shortly.</div>
  </form>
</section>`;
page('contact.html', 'Contact · P&P Montaža', 'contact', contact);

console.log('built', fs.readdirSync(out).filter(f => f.endsWith('.html')).join(', '));
