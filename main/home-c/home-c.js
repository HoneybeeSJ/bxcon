/* BX 홈페이지 C안 시안 동작. gsap·ScrollTrigger·Lenis는 CDN 전역을 쓴다. */

(() => {
// 전역 smooth 스크롤이 끝나기 전에 pin 위치를 계산하지 않도록 즉시 복귀한다.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo({ top: 0, left: 0, behavior: 'instant' });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap || !window.ScrollTrigger;
document.querySelector('.home-c').classList.toggle('reduced', reduce);
if (!reduce) {
  gsap.registerPlugin(ScrollTrigger);
  // 서비스 장면마다 없는 요소(차트 선·카운터 등)는 비어 있는 게 정상이라 'target not found' 경고를 끈다
  gsap.config({ nullTargetWarn: false });
}

// 부드러운 스크롤 (루아소프트와 같은 Lenis)
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// 폰트 로드와 pin 생성 사이에 복원된 native/Lenis 위치를 같은 기준으로 맞춘다.
function resetScrollPosition() {
  if (!reduce) ScrollTrigger.clearScrollMemory('manual');
  scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(0, { immediate: true, force: true });
  }
}

// 모바일 메뉴
const menuBtn = document.querySelector('.menu-btn'), gnav = document.getElementById('gnav');
const setMenu = open => { gnav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.textContent = open ? '닫기' : '메뉴'; };
menuBtn.addEventListener('click', () => setMenu(!gnav.classList.contains('open')));
gnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && gnav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
matchMedia('(min-width: 769px)').addEventListener('change', e => {
  if (e.matches) setMenu(false);
  // 768px을 넘나들면 PC/모바일 레이아웃과 스크롤 연출이 통째로 바뀐다. 스크롤한 채로 바뀌면 고정 구간 시작 위치가 틀어져 첫 화면이 비므로, 처음부터 다시 불러온다 (DevTools 기기 전환·태블릿 회전 때만 발생)
  location.reload();
});

// 글자 단위 분리. 스크린리더에는 원문만 읽히도록 조각은 숨긴다.
function splitChars(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  const chars = [];
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          [...part].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s); chars.push(s); });
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = label; el.prepend(sr);
  return chars;
}
const splits = new Map();
document.querySelectorAll('.split').forEach(el => splits.set(el, splitChars(el)));

// 화면 밖 카드의 떠다니는 애니메이션은 멈춤 (27장이 계속 돌면 모바일에서 섹션 진입 때 버벅임)
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('off', !e.isIntersecting)), { rootMargin: '120px 0px' });
  document.querySelectorAll('.gc').forEach(el => { el.classList.add('off'); io.observe(el); });
}

document.querySelectorAll('.art .dr').forEach(el => { const L = el.dataset.len || '1'; el.setAttribute('pathLength', '1'); el.style.strokeDasharray = L + ' 3'; });
const header = document.querySelector('.home-c header');
if (!reduce) ScrollTrigger.create({ start: 'top -40', end: 'max', toggleClass: { targets: header, className: 'scrolled' } });

/* ---------- 줄무늬 BX 선 그래픽 (히어로·스토리 공용) ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function makeStrips(colors) {
  return colors.map(c => {
    const k = document.createElement('canvas'); k.width = 1; k.height = 64;
    const x = k.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(0.22, `rgba(${c},1)`);
    g.addColorStop(0.78, `rgba(${c},1)`); g.addColorStop(1, `rgba(${c},.2)`);
    x.fillStyle = g; x.fillRect(0, 0, 1, 64); return k;
  });
}
const SERVICES = ['경영전략', '영업·마케팅', '고객경험', '인사조직', '리서치', '시스템', 'AI'];

function Field(cv, cfg) {
  const ctx = cv.getContext('2d'), strips = makeStrips(cfg.colors);
  const S = { intro: 0, blow: 0, wind: 0, land: 0, fade: 1, mx: 0, my: 0 };
  let W = 0, H = 0, segs = [], visible = true, mxT = 0, myT = 0;
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(cv);
  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    if (W < 10 || H < 10) { segs = []; return; }
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const box = cfg.box(W, H);
    const ow = Math.round(box.w), oh = Math.round(ow * 0.48);
    const off = document.createElement('canvas'); off.width = ow; off.height = oh;
    const o = off.getContext('2d');
    o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle';
    o.font = `900 ${Math.round(oh * 1.12)}px Pretendard, 'Arial Black', sans-serif`;
    o.fillText('BX', ow / 2, oh / 2 + oh * 0.04);
    const data = o.getImageData(0, 0, ow, oh).data;
    const step = Math.max(5, Math.round(ow / 90));
    const ox = box.cx - ow / 2, oy = box.cy - oh / 2;
    segs = [];
    for (let x = 0; x < ow; x += step) {
      let run = false, st = 0;
      for (let y = 0; y <= oh; y++) {
        const on = y < oh && data[(y * ow + x) * 4 + 3] > 128;
        if (on && !run) { run = true; st = y; }
        else if (!on && run) { run = false; if (y - st > 3) segs.push({ bx: ox + x, by1: oy + st, by2: oy + y }); }
      }
    }
    const n = segs.length, N = SERVICES.length;
    const laneCount = Array(N).fill(0), perLane = Array(N).fill(0);
    segs.forEach((s, i) => { s.lane = Math.min(N - 1, Math.floor(i / n * N)); laneCount[s.lane]++; });
    segs.forEach((s, i) => {
      const len = 40 + Math.random() * H * 0.4;
      s.sx = Math.random() * W; s.sy1 = Math.random() * (H - len); s.sy2 = s.sy1 + len;
      s.fx = Math.random() * W; s.fy = H * (0.05 + Math.random() * 0.9); s.fl = 8 + Math.random() * 22;
      s.dep = 0.3 + Math.random() * 0.7;
      s.d = Math.random() * 0.4; s.d2 = Math.random() * 0.25;
      s.a = 0.45 + Math.random() * 0.55; s.ci = i % strips.length;
      s.p = Math.random() < 0.28; s.v = 0.15 + Math.random() * 0.35; s.o = Math.random(); s.ph = Math.random() * 6.28;
      s.w = step * 0.52;
      if (cfg.lanes) {
        const L = cfg.lanes(s.lane, W, H), k = perLane[s.lane]++;
        s.lx = L.cx + (k / Math.max(1, laneCount[s.lane] - 1) - 0.5) * L.w;
        const j = (L.b - L.t) * 0.12;
        s.ly1 = H * L.t + Math.random() * j * H; s.ly2 = H * L.b - Math.random() * j * H;
      }
    });
    cfg.onBuild && cfg.onBuild(W, H);
  }
  function draw() {
    if (!visible || !segs.length) return;
    const time = performance.now() / 1000;
    S.mx += (mxT - S.mx) * 0.06; S.my += (myT - S.my) * 0.06;
    ctx.clearRect(0, 0, W, H);
    const bob = reduce ? 0 : Math.sin(time * 0.9) * 6 * S.intro;
    for (const s of segs) {
      const ti = ease(clamp(S.intro * 1.4 - s.d));
      const tb = ease(clamp(S.blow * 1.3 - s.d2));
      const tl = cfg.lanes ? ease(clamp(S.land * 1.3 - s.d2)) : 0;
      const drift = reduce ? 0 : Math.sin(time * 0.6 + s.ph) * 18 * (1 - ti);
      // 1) 흩어짐 → BX
      let x = lerp(s.sx + drift, s.bx + S.mx * 18 * s.dep, ti);
      let y1 = lerp(s.sy1, s.by1 + bob + S.my * 12 * s.dep, ti), y2 = lerp(s.sy2, s.by2 + bob + S.my * 12 * s.dep, ti);
      let w = lerp(1, s.w, ti);
      // 2) BX → 씨앗처럼 흩날림
      if (tb > 0) {
        const fx = s.fx + Math.sin(time * 0.4 + s.ph) * 26 + S.wind * W * 0.18 * s.dep;
        const fy = s.fy + Math.cos(time * 0.5 + s.ph) * 16 - S.wind * H * 0.12 * s.dep;
        x = lerp(x, fx, tb); y1 = lerp(y1, fy, tb); y2 = lerp(y2, fy + s.fl, tb); w = lerp(w, 1.3, tb);
      }
      // 3) 씨앗 → 7개 서비스 줄기로 내려앉음
      if (tl > 0) { x = lerp(x, s.lx, tl); y1 = lerp(y1, s.ly1, tl); y2 = lerp(y2, s.ly2, tl); w = lerp(w, 1.6, tl); }
      ctx.globalAlpha = lerp(0.28, s.a, Math.max(ti, tl)) * S.fade;
      ctx.drawImage(strips[s.ci], 0, 0, 1, 64, x - w / 2, y1, w, Math.max(1, y2 - y1));
      if (tb > 0.5 && tl < 0.5) { ctx.beginPath(); ctx.arc(x, y1, 1.8, 0, 6.28); ctx.fillStyle = cfg.dot; ctx.fill(); }
      if (s.p && !reduce && ti > 0.9) {
        const py = y1 + ((time * s.v + s.o) % 1) * (y2 - y1);
        ctx.fillStyle = cfg.dot; ctx.beginPath(); ctx.arc(x, py, 1.5, 0, 6.28); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 영역 크기 변화(창·패널 크기 조절 포함)를 감지해 매번 다시 계산 → 화면을 키워도 간격이 틀어지지 않음
  let rt, lw = 0, lh = 0;
  new ResizeObserver(() => {
    if (cv.clientWidth === lw && cv.clientHeight === lh) return;
    lw = cv.clientWidth; lh = cv.clientHeight;
    clearTimeout(rt); rt = setTimeout(() => { build(); if (!reduce) ScrollTrigger.refresh(); draw(); }, 120);
  }).observe(cv);
  if (cfg.parallax && !reduce) cfg.parallax.addEventListener('pointermove', e => {
    const r = cfg.parallax.getBoundingClientRect();
    mxT = (e.clientX - r.left) / r.width - 0.5; myT = (e.clientY - r.top) / r.height - 0.5;
  });
  return { S, build, draw };
}

const narrow = () => innerWidth <= 768;
// 스토리 구간 서비스 줄기: 넓은 화면은 7개 한 줄, 좁은 화면은 4+3 두 줄. 라벨은 항상 자기 칸 안에 들어가게 맞춘다
const story = Field(document.getElementById('storyCv'), {
  colors: ['61,114,240', '47,92,214', '96,170,255', '106,92,255'], dot: 'rgba(61,114,240,.85)',
  box: (W, H) => {
    const hero = document.querySelector('.hero-first'), copy = document.querySelector('.hero-copy');
    const textTop = hero.clientHeight - parseFloat(getComputedStyle(hero).paddingBottom) - copy.offsetHeight;
    if (narrow()) {
      /* 모바일: BX를 문구 쪽으로 내려 간격을 줄임 (헤더 아래 80px 안쪽은 지킴) */
      const w = Math.min(W * 1.08, 500), oh = w * 0.48;
      return { cx: W / 2, cy: Math.max(80 + oh / 2, Math.min(H * 0.3 + 200, textTop - 20 - oh / 2)), w };
    }
    /* PC: 낮은 화면에서도 BX가 헤드라인과 겹치지 않게 문구 윗선에서 간격을 두고 크기를 줄임 */
    const top = 96, gap = 28, ratio = 0.48;
    const w = Math.max(160, Math.min(W * 0.48, 700, (textTop - gap - top) / ratio));
    const oh = w * ratio;
    return { cx: W / 2, cy: Math.min(H * 0.36, textTop - gap - oh / 2), w };
  },
  parallax: document.querySelector('.story')
});



/* ---------- 실행 ---------- */
document.fonts.load('900 100px Pretendard').catch(() => {}).finally(() => {
  resetScrollPosition();
  story.build();
  if (reduce) {
    story.S.intro = 1; story.draw();
    document.getElementById('veil').remove(); document.querySelector('.story').classList.remove('dark0'); document.querySelector('.home-c header').classList.remove('on-dark');
    return;
  }
  gsap.ticker.add(() => story.draw());
  initMotion();
  ScrollTrigger.refresh();
  resetScrollPosition();
  ScrollTrigger.update();
});

function initMotion() {
  // 인트로: 흩어진 줄기가 BX로 모임 → 문구 글자 등장 (별도 로딩 화면 없이 히어로가 곧바로 시작)
  const heroSlides = [...document.querySelectorAll('.slide')];
  const heroChars = heroSlides.map(sl => splits.get(sl.querySelector('.slide-title')));
  gsap.set(heroChars.flat(), { opacity: 0 });
  gsap.set(['.slide .hero-sub', '.hero-row'], { opacity: 0, y: 14 });
  gsap.set('.home-c header', { opacity: 0 });
  lenis && lenis.stop();
  const intro = gsap.timeline({ delay: 0.25, onComplete: () => { lenis && lenis.start(); toLight(); } });
  // C안: 검정에서 시작 → 검은 줄무늬가 가늘어지며 흰 바탕으로 (한 번만)
  const veilBars = [...document.querySelectorAll('#veil i')];
  const toLight = () => { document.querySelector('.story').classList.remove('dark0'); document.querySelector('.home-c header').classList.remove('on-dark'); gsap.set('#veil', { display: 'none' }); };
  intro.to(story.S, { intro: 1, duration: 2.6, ease: 'power2.inOut' })
    .to('.home-c header', { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.4)
    ;
  // 문구 글자들이 위아래로 흩어져 있다가 BX 줄무늬가 모이는 시점에 맞춰 제자리로 모임 (처음 한 번만, 동작 줄이기 설정이면 이 함수 자체가 실행되지 않음)
  const rnd = k => () => gsap.utils.random(-1, 1) * k;
  intro.fromTo(heroChars.flat(), { opacity: 0, y: rnd(matchMedia('(max-width:768px)').matches ? 24 : innerHeight * 0.2 + 40) },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: { each: 0.008, from: 'random' } }, 1.1)
    .to(['.slide .hero-sub', '.hero-row'], { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' }, 2.5);
  intro.to(veilBars, { scaleX: 0, duration: 1.0, ease: 'power2.inOut', stagger: { each: 0.02, from: 'random' } }, 3.0)
    .add(() => { document.querySelector('.story').classList.remove('dark0'); document.querySelector('.home-c header').classList.remove('on-dark'); }, 3.2);
  const skip = () => { if (intro.isActive()) { intro.progress(1, false); lenis && lenis.start(); toLight(); } };
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, skip, { once: true, passive: true }));

  // 섹션 제목 글자 등장
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.from(splits.get(el), { opacity: 0, yPercent: 60, stagger: 0.02, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // 스크롤을 멈추면 가장 가까운 '완성된 장면' 위치로 부드럽게 붙음 (위로 올릴 때도 같음)
  // 1 LANDING 고정: BX가 씨앗처럼 흩어짐 → 문장 3줄이 차례로 → 7개 줄기로 내려앉고 라벨 등장 (PC·모바일 공통)
  const storyTL = () => {
    const lines = gsap.utils.toArray('.st-line');
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.story', start: 'top top', end: () => '+=' + innerHeight * (narrow() ? 1 : 1.8), pin: true, scrub: 0.8 } })
      .to('.hero-first', { opacity: 0, y: -40, duration: 0.07, ease: 'none' }, 0)
      .to(story.S, { blow: 1, duration: 0.2, ease: 'none' }, 0.06)
      .to(story.S, { wind: 1, duration: 0.62, ease: 'none' }, 0.1)
      .fromTo(lines[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.07 }, 0.13)
      .to(lines[0], { opacity: 0, y: -30, duration: 0.05 }, 0.27)
      .fromTo(lines[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.07 }, 0.31)
      .to(lines[1], { opacity: 0, y: -30, duration: 0.05 }, 0.47)
      .fromTo(lines[2], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.07 }, 0.51)
      .to({}, { duration: 0.02 }, 0.98);
    // 마지막 문장과 줄무늬는 고정이 풀려 위로 올라가는 동안 사라지고, 같은 순간 서비스 상세가 아래에서 올라옴 (빈 화면 없이 이어짐)
    gsap.timeline({ scrollTrigger: { trigger: '.biz', start: 'top bottom', end: 'top 25%', scrub: true } })
      .to(story.S, { fade: 0, ease: 'none' }, 0)
      .to(lines[2], { opacity: 0, ease: 'none' }, 0);
    return tl;
  };

  // 서비스 장면 하나의 등장 모션: 카드가 떠오르고 선이 그려지고 숫자가 올라감 (PC는 스크롤 타임라인, 모바일은 넘길 때마다 재생)
  const chaps = gsap.utils.toArray('.chap'), bars = gsap.utils.toArray('.biz-prog b');
  const fmtN = (v, el) => { const d = +el.dataset.dec; let t = v.toFixed(d); if (el.dataset.comma === '1') t = (+t).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); return el.dataset.pre + t + el.dataset.suf; };
  const updCnt = (tl, counters) => { const tt = tl.time(); counters.forEach(k => { const x = clamp((tt - k.s) / k.d); k.el.textContent = fmtN(k.to * (1 - Math.pow(1 - x, 3)), k.el); }); };
  function chapAnim(tl, c, t0, counters) {
    const art = c.querySelector('.art'), q = sel => art.querySelectorAll(sel);
    tl.fromTo(c.querySelector('h3 span'), { yPercent: 110 }, { yPercent: 0, duration: 0.2, ease: 'power3.out' }, t0)
      .fromTo(c.querySelectorAll('.num,p,.tags,.btn'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.16, ease: 'power2.out' }, t0)
      .fromTo(q('.gc'), { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.2, ease: 'power3.out' }, t0)
      .fromTo(q('.gx'), { scaleX: 0 }, { scaleX: 1, stagger: 0.03, duration: 0.35, ease: 'power2.out' }, t0 + 0.2)
      .fromTo(q('.gy'), { scaleY: 0 }, { scaleY: 1, stagger: 0.04, duration: 0.35, ease: 'power2.out' }, t0 + 0.2)
      .fromTo(q('.fillp'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0 + 0.3)
      .fromTo(q('.pop'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.03, duration: 0.2, ease: 'back.out(2.2)' }, t0 + 0.36)
      .fromTo(q('.row'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out' }, t0 + 0.22)
      .fromTo(q('.kp,.fn,.rw'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.2, ease: 'power2.out' }, t0 + 0.16);
    q('.dr').forEach((el, k) => tl.fromTo(el, { strokeDashoffset: (+el.dataset.len || 1) + 0.02 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, t0 + 0.14 + k * 0.04));
    q('.cnt').forEach(el => counters.push({ el, s: t0 + 0.2, d: 0.4, to: +el.dataset.to }));
    q('.stp').forEach(el => tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, t0 + +el.dataset.at));
    q('.dots').forEach(el => tl.to(el, { opacity: 0, duration: 0.04 }, t0 + 0.38));
    q('.rvt').forEach(el => tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.2, ease: 'none' }, t0 + +el.dataset.at + 0.02));
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', () => {
    storyTL();

    // 3 SERVICES 고정: 서비스 7개가 차례로 바뀜
    const glow = document.querySelector('.biz-glow');
    const SEG = 1, TOTAL = chaps.length * SEG + 0.15;
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.biz', start: 'top top', end: () => '+=' + innerHeight * 4.2, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    const counters = [];
    chaps.forEach((c, i) => {
      const t0 = i * SEG;
      chapAnim(tl, c, t0, counters);
      tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: SEG, ease: 'none' }, t0)
        .to(glow, { yPercent: -50 + (i % 2 ? 6 : -6), duration: SEG, ease: 'none' }, t0);
      // 나가는 장면은 경계 직전까지 보이다가 서둘러 사라지고, 들어오는 장면은 경계에서 바로 시작 (사이에 빈 화면이 길게 남지 않게)
      if (i < chaps.length - 1) tl.to(c, { opacity: 0, y: -36, duration: 0.1, ease: 'power2.in' }, t0 + SEG - 0.1);
      else tl.to({}, { duration: 0.15 }, t0 + SEG);
      if (i > 0) tl.fromTo(c, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, t0);
    });
    // 숫자는 타임라인 시간에서 직접 계산 (스크롤을 올리고 내려도 항상 같은 값)
    // 장면이 보이는 구간은 타임라인 시간에서 직접 계산 (set으로 켜고 끄면 거꾸로 스크롤할 때 되돌아오지 않는 경우가 있었음)
    gsap.set(chaps[0], { opacity: 1 });
    const updVis = () => { const tt = tl.time(); chaps.forEach((c, i) => { c.style.visibility = (tt >= i * SEG && (i === chaps.length - 1 || tt < (i + 1) * SEG)) ? 'inherit' : 'hidden'; }); };
    tl.eventCallback('onUpdate', () => { updCnt(tl, counters); updVis(); }); updCnt(tl, counters); updVis();
    // 장면 안 링크에 키보드 포커스가 가면 그 장면이 보이는 위치로 스크롤
    const stage = document.querySelector('.biz-stage');
    const onFocus = e => {
      const c = e.target.closest('.chap'); if (!c) return;
      const i = chaps.indexOf(c), st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * ((i * SEG + 0.7) / tl.duration());
      lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
    };
    stage.addEventListener('focusin', onFocus);

    // 5 SALES TRAINING 고정: 선이 다음 카드에 닿을 때마다 그 카드가 하나씩 켜짐 (스크롤을 올리면 거꾸로)
    const steps = gsap.utils.toArray('.step'), fill = document.querySelector('.rail b'), prog = { p: 0 };
    const smooth = t => t * t * (3 - 2 * t);
    const render = () => {
      const p = prog.p, f = clamp((p - 0.05) / 0.9);
      fill.style.transform = `scaleX(${f.toFixed(4)})`;
      steps.forEach((s, i) => s.style.setProperty('--k', smooth(clamp((p - (0.05 + i * 0.3)) / 0.06)).toFixed(3)));
    };
    gsap.timeline({ scrollTrigger: { trigger: '.flow', start: 'top top', end: () => '+=' + innerHeight * 1.6, pin: true, scrub: 0.8 } })
      .to(prog, { p: 1, duration: 0.88, ease: 'none', onUpdate: render })
      .to({}, { duration: 0.12 });
    render();

    // 헤더 색: 남색·파란 면 위에서는 흰 글자 (서비스는 카드가 화면을 다 덮은 뒤부터)
    const dark = new Set();
    const mark = (key, on) => { on ? dark.add(key) : dark.delete(key); header.classList.toggle('on-dark', dark.size > 0); };
    const wrap = el => el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
    document.querySelectorAll('[data-dark]').forEach(sec => ScrollTrigger.create({ trigger: wrap(sec), start: 'top 64px', end: 'bottom 64px', onToggle: s => mark(sec, s.isActive) }));

    // 모바일 폭으로 바뀌면 PC에서 직접 켜고 끈 장면 표시값을 지워야 모바일 CSS(모두 보임)가 적용됨
    return () => { stage.removeEventListener('focusin', onFocus); header.classList.remove('on-dark'); chaps.forEach(c => { c.style.visibility = ''; }); };
  });
  mm.add('(max-width: 768px)', () => {
    const dark = new Set();
    const mark = (key, on) => { on ? dark.add(key) : dark.delete(key); header.classList.toggle('on-dark', dark.size > 0); };
    document.querySelectorAll('[data-dark]').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 56px', end: 'bottom 56px', onToggle: s => mark(sec, s.isActive) }));
    storyTL();

    // 3 SERVICES 세로 나열: 서비스가 화면에 들어올 때 그 서비스의 등장 모션을 한 번 재생
    const tls = chaps.map(c => {
      const counters = [], tl = gsap.timeline({ paused: true });
      chapAnim(tl, c, 0, counters);
      tl.timeScale(0.6).eventCallback('onUpdate', () => updCnt(tl, counters));
      // PC처럼 위로 올라올 때도 다시 재생: 화면에 들어올 때(아래로·위로 모두) 처음부터 재생하고, 화면 밖으로 나가면 시작 상태로 되돌려 둠
      const play = () => tl.restart();
      const reset = () => tl.pause(0);
      const st = ScrollTrigger.create({ trigger: c, start: 'top 78%', end: 'bottom 15%', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset });
      if (st.isActive) play();
      return tl;
    });

    gsap.utils.toArray('.step').forEach(s => { s.style.setProperty('--k', 0); ScrollTrigger.create({ trigger: s, start: 'top 85%', end: 'top 60%', scrub: true, onUpdate: self => s.style.setProperty('--k', self.progress.toFixed(3)) }); });
    return () => {
      header.classList.remove('on-dark');
      tls.forEach(t => t.progress(1).kill());
    };
  });

  // 공통: 화면에 들어올 때 아래에서 올라옴
  gsap.set('.fx-up', { opacity: 0, y: 30 });
  ScrollTrigger.batch('.fx-up', { start: 'top 96%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' }) });
  // CRM 화면: 스크롤에 맞춰 떠오름
  gsap.from('.crm-shot', { y: 90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.crm', start: 'top 85%', end: 'center center', scrub: 0.6 } });
  // 수행사례 카드: 아래에서 차례로 올라옴
  gsap.from('.case', { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cases-track', start: 'top 85%' } });
  // CTA: 남색 띠가 살짝 커지며 등장
}
})();


/* 메뉴 드롭다운: 하나만 열고, 바깥 클릭·Esc로 닫는다 */
(function(){var groups=[].slice.call(document.querySelectorAll('#gnav .ng'));
groups.forEach(function(g){g.addEventListener('toggle',function(){if(g.open)groups.forEach(function(o){if(o!==g)o.open=false;});});});
document.addEventListener('click',function(e){groups.forEach(function(g){if(!g.contains(e.target))g.open=false;});});
addEventListener('keydown',function(e){if(e.key==='Escape'){var o=groups.filter(function(g){return g.open})[0];if(o){o.open=false;o.querySelector('summary').focus();}}});})();
