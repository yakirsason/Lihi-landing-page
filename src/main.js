import './styles.css';
import { business, concerns, results, testimonials, reviewSlots, steps, faqs, questionnaire, whatsappUrl } from './content.js';
import { mediaById, mediaSource } from './media.js';
import { icon } from './icons.js';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const brand = (responsive = false) => `<picture class="brand" dir="ltr">${responsive ? '<source media="(max-width: 600px)" srcset="/brand/lihi-wordmark.png">' : ''}<img class="brand-logo" src="/brand/lihi-skin-studio.png" width="1278" height="523" alt="${escape(business.brand)}" loading="${responsive ? 'eager' : 'lazy'}" decoding="async"></picture>`;
const cta = (label = 'לתיאום טיפול בוואטסאפ', message, cls = '') => `<a class="button ${cls}" href="${escape(whatsappUrl(message))}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')}<span>${label}</span>${icon('arrow', 'button-arrow')}</a>`;
const heading = (en, title, sub = '', cls = '') => `<div class="section-heading ${cls}"><span class="eyebrow" lang="en" dir="ltr">${en}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;

function media(id, cls = '', { label = true, priority = false, preview = true } = {}) {
  const entry = mediaById[id];
  const src = mediaSource(id);
  const poster = entry.posterId ? mediaSource(entry.posterId) : null;
  let visual = '';
  if (src && entry.type === 'image') {
    visual = `<picture>${mediaSource(id, true) && entry.mobilePath ? `<source media="(max-width: 600px)" srcset="${mediaSource(id, true)}">` : ''}<img src="${src}" alt="${escape(entry.alt)}" loading="${priority ? 'eager' : 'lazy'}" ${priority ? 'fetchpriority="high"' : ''} decoding="async"></picture>`;
  } else if (src && !preview) {
    visual = `<video controls playsinline preload="none" ${poster ? `poster="${poster}"` : ''} aria-label="${escape(entry.alt)}"><source src="${src}" type="video/mp4"><p>הדפדפן שלך אינו תומך בסרטון.</p></video>`;
  } else if (src && preview && poster) {
    visual = `<img src="${poster}" alt="${escape(entry.alt)}" loading="lazy" decoding="async">`;
  }
  return `<div class="media media--${entry.tone} ${cls} ${visual ? 'has-asset' : 'is-placeholder'}" data-media-id="${id}" style="--media-ratio:${entry.ratio}">${visual || `<div class="media-art" aria-hidden="true"><span class="art-arch"></span><span class="art-orb"></span><span class="art-line"></span><span class="art-leaf">${icon('leaf')}</span></div><div class="media-caption">${icon(entry.type === 'video' ? 'play' : 'image')}<span>${escape(entry.label)}</span><small>${entry.type === 'video' ? 'הסרטון יתווסף בקרוב' : 'התמונה תתווסף בקרוב'}</small></div>`}${label && visual ? `<span class="asset-caption">${escape(entry.label)}</span>` : ''}</div>`;
}

function resultMarkup(index) {
  const result = results[index];
  const ready = mediaSource(`result-${result.id}-before`) && mediaSource(`result-${result.id}-after`);
  return `<div class="comparison ${ready ? 'has-results' : ''}" style="--split:50%;--comparison-ratio:${mediaById[`result-${result.id}-before`].ratio}" dir="ltr">
    <div class="comparison-layer comparison-before">${media(`result-${result.id}-before`, '', { label: false })}</div>
    <div class="comparison-layer comparison-after">${media(`result-${result.id}-after`, '', { label: false })}</div>
    <span class="compare-label before-label" dir="rtl">לפני</span><span class="compare-label after-label" dir="rtl">אחרי</span>
    <span class="compare-line"><span>‹ ›</span></span>
    <input class="compare-range" type="range" min="5" max="95" value="50" aria-label="השוואת לפני ואחרי — תיעוד ${result.id}" aria-valuetext="50 אחוז לפני ו־50 אחוז אחרי">
    ${ready ? '' : '<span class="comparison-disclaimer" dir="rtl">מקום לתיעוד אמיתי · התמונות יתווספו בהמשך</span>'}
  </div>`;
}

document.querySelector('#app').innerHTML = `
  <header class="site-header"><div class="header-inner wrap">
    <a href="#home" class="brand-link" aria-label="${escape(business.brand)} — לראש הדף">${brand(true)}</a>
    <nav class="desktop-nav" aria-label="ניווט ראשי"><a href="#home" class="active">בית</a><a href="#concerns">טיפולים</a><a href="#results">תוצאות</a><a href="#about">אודות</a><a href="#gallery">גלריה</a><a href="#faq">שאלות נפוצות</a></nav>
    ${cta('לתיאום טיפול', undefined, 'header-cta')}
    <button class="menu-toggle icon-button" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
  </div><nav id="mobile-nav" class="mobile-nav" aria-label="ניווט לנייד" hidden><a href="#home">בית</a><a href="#concerns">טיפולים</a><a href="#results">תוצאות</a><a href="#about">אודות ליהי</a><a href="#gallery">הקליניקה</a><a href="#faq">שאלות נפוצות</a></nav></header>
  <main id="main">
    <section class="hero" id="home" aria-labelledby="hero-title"><div class="hero-inner wrap">
      <div class="hero-copy"><div class="hero-eyebrow"><span></span>קוסמטיקה אישית. מחשבה עמוקה.</div><h1 id="hero-title">הדרך שלך <br>לעור בריא ומלא<br><span>ביטחון מתחילה כאן.</span></h1><p>טיפולי פנים בהתאמה אישית, אבחון מקצועי<br class="desktop-break"> וליווי בדרך לעור מאוזן ומטופח.</p>${cta()}<div class="hero-trust"><span>${icon('heart')}יחס אישי</span><span>${icon('diamond')}אבחון מקצועי</span><span>${icon('leaf')}התאמה לעור שלך</span></div></div>
      <div class="hero-visual">${media('hero-portrait', 'hero-media', { priority: true })}<span class="hero-orbit" aria-hidden="true"></span><div class="hero-signature">ליהי פרנס רפפורט<small>טיפול שמתחיל בהקשבה</small></div><button class="hero-video-link" data-lightbox="hero-video" aria-label="הצצה לקליניקה">${icon('play')}<span>רגע של שקט. זמן לעצמך.</span></button></div>
    </div><span class="hero-side-note" dir="ltr" lang="en">YOUR SKIN. YOUR STORY.</span></section>
    <div class="brand-note"><span></span><p>כי העור שלך הוא חלק מהסיפור שלך.</p><span></span></div>

    <section class="section concerns-section wrap" id="concerns">${heading('SKIN CONCERNS', 'מה העור שלך באמת צריך?', 'לכל עור צרכים משלו. מתחילות בלהכיר את שלך.')}
      <div class="concern-grid">${concerns.map((item, i) => `<article class="concern-card reveal">${media(`concern-${item.id}`)}<div class="concern-body"><span class="concern-icon">${icon(item.icon)}</span><span class="card-number" dir="ltr">0${i + 1}</span><h3>${item.title}</h3><p>${item.description}</p><a class="text-link" href="${escape(whatsappUrl(`היי ליהי, אשמח להתייעץ לגבי ${item.title} ולבדוק מה מתאים לעור שלי.`))}" target="_blank" rel="noopener noreferrer">בואי נדבר על זה ${icon('arrow')}</a></div></article>`).join('')}</div>
      <p class="section-note">נושאים להתייעצות; סוג הטיפול ייקבע לאחר היכרות ואבחון אישי.</p>
    </section>

    <section class="section results-section" id="results"><div class="wrap results-layout"><div class="results-copy">${heading('REAL SKIN. PERSONAL JOURNEY.', 'תוצאות שמדברות<br>בעד עצמן', 'תהליך אישי, תשומת לב לפרטים<br>ומקום לשינוי בקצב של העור שלך.', 'align-start')}<div class="result-description" aria-live="polite"><h3>${results[0].title}</h3><p>${results[0].text}</p></div><div class="carousel-controls"><button class="icon-button result-prev" aria-label="לתוצאה הקודמת">${icon('arrow')}</button><div class="result-dots dots">${results.map((_, i) => `<button aria-label="הצגת תיעוד ${i + 1}" aria-pressed="${i === 0}" data-result="${i}" class="dot ${i === 0 ? 'is-active' : ''}"></button>`).join('')}</div><button class="icon-button result-next" aria-label="לתוצאה הבאה">${icon('arrow')}</button></div><p class="results-note">התוצאות משתנות מאדם לאדם. תיעוד יפורסם בהסכמה בלבד.</p></div><div class="result-stage">${resultMarkup(0)}<span class="slider-hint">${icon('arrow')} גררי כדי להשוות בין לפני ואחרי</span></div></div></section>

    <section class="section about-section wrap" id="about"><div class="about-visual">${media('about-portrait', 'about-portrait')}<button class="certificate" data-lightbox="certification" aria-label="צפייה במקום המיועד לתעודת ההכשרה">${media('certification')}<span>מקצועיות, עד הפרטים הקטנים ${icon('arrow')}</span></button></div><div class="about-copy">${heading('A PERSONAL APPROACH', 'נעים להכיר, ליהי', 'ליהי פרנס רפפורט · קוסמטיקה אישית', 'align-start')}${business.about.map(p => `<p>${p}</p>`).join('')}<div class="about-values"><span>${icon('face')}מסתכלת על העור. רואה אותך.</span><span>${icon('leaf')}התאמה אישית, בכל שלב בדרך.</span><span>${icon('heart')}מרחב נעים, גישה קשובה.</span></div>${business.training ? `<p>${escape(business.training)}</p>` : ''}${cta('בואי נכיר', 'היי ליהי, אשמח להכיר ולשמוע על מפגש ראשון בקליניקה.', 'button-outline')}</div></section>

    <section class="section experience-section" id="experience"><div class="wrap">${heading('THE TREATMENT EXPERIENCE', 'הדרך שלך לעור מטופח', 'תהליך אישי. גישה מקצועית. רגע שהוא רק שלך.')}<div class="steps">${steps.map((step, i) => `<article class="step reveal"><div class="step-icon">${icon(step.icon)}<span dir="ltr">0${i + 1}</span></div><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div><div class="treatment-media"><button class="treatment-film media-button" data-lightbox="treatment-video" aria-label="צפייה בסרטון חוויית הטיפול">${media('treatment-video')}<span class="film-overlay"><span class="play-circle">${icon('play')}</span><span>הצצה לרגע שלך בקליניקה<small>${mediaSource('treatment-video') ? 'טיפול אישי, מקרוב' : 'סרטון הטיפול יתווסף בקרוב'}</small></span></span><span class="film-corner" dir="ltr">A MOMENT FOR YOURSELF</span></button><button class="treatment-detail media-button" data-lightbox="treatment-detail" aria-label="צפייה בפרטים הקטנים של הטיפול">${media('treatment-detail')}</button></div></div></section>

    <section class="section reviews-section wrap" id="testimonials">${heading('WORDS FROM THE HEART', 'מה הלקוחות מספרות?', 'הסיפורים האישיים שמאחורי המפגש.')}<div class="review-carousel"><button class="icon-button review-prev" aria-label="לחוות הדעת הקודמת">${icon('chevron')}</button><div class="review-track" tabindex="0" aria-label="גלריית חוות דעת">${(testimonials.length ? testimonials : reviewSlots).map((review, i) => `<article class="review-card"><span class="quote-mark" aria-hidden="true">“</span><span class="review-status">${testimonials.length ? 'חוות דעת מהקליניקה' : 'מקום לחוות דעת מאושרת'}</span>${testimonials.length ? '' : `<h3>${review.title}</h3>`}<p>${escape(review.text)}</p><div class="review-person">${review.photoId ? media(review.photoId, 'review-avatar') : `<span class="review-avatar">${icon('face')}</span>`}<div><strong>${escape(review.name || 'הסיפור שלך, בקרוב כאן')}</strong><small>${escape(review.detail || (testimonials.length ? '' : 'חוות הדעת יתווספו לאחר אישור'))}</small></div>${review.screenshotId ? `<button class="text-link" data-lightbox="${escape(review.screenshotId)}" aria-label="צפייה בחוות הדעת המקורית">${icon('image')}</button>` : ''}</div></article>`).join('')}</div><button class="icon-button review-next" aria-label="לחוות הדעת הבאה">${icon('chevron')}</button></div><div class="review-dots dots">${(testimonials.length ? testimonials : reviewSlots).map((_, i) => `<button class="dot ${i === 0 ? 'is-active' : ''}" data-review="${i}" aria-label="מעבר לחוות דעת ${i + 1}" aria-pressed="${i === 0}"></button>`).join('')}</div></section>

    <section class="section gallery-section" id="gallery"><div class="wrap">${heading('A SPACE TO FEEL GOOD', 'מקום שמוקדש כולו לעור שלך', 'הקליניקה, הטיפוח והפרטים שיוצרים את האווירה.')}<div class="gallery-grid">${['clinic-interior', 'clinic-products', 'clinic-room', 'clinic-video', 'clinic-atmosphere'].map((id, i) => `<button class="gallery-item gallery-item-${i + 1} media-button reveal" data-lightbox="${id}" aria-label="פתיחת ${mediaById[id].label}">${media(id)}<span class="gallery-label">${mediaById[id].label}${icon(mediaById[id].type === 'video' ? 'play' : 'arrow')}</span></button>`).join('')}</div></div></section>

    <section class="section questionnaire-section wrap" id="questionnaire"><div class="questionnaire-intro">${heading('LET’S TALK ABOUT YOUR SKIN', 'בואי נכיר את העור שלך', 'שתי שאלות קטנות. התחלה של היכרות אישית.', 'align-start')}${media('questionnaire', 'questionnaire-media')}<p class="section-note">השאלון ראשוני ואינו מחליף אבחון מקצועי בקליניקה.</p></div><div class="questionnaire-panel"><div class="quiz-progress"><span class="quiz-step is-active"><b>01</b>העור שלך</span><span class="progress-line"></span><span class="quiz-step"><b>02</b>קצת יותר לעומק</span></div><form id="skin-quiz"><div id="quiz-content"></div></form><p class="quiz-privacy">${icon('shield')}הבחירות נשארות כאן ונשלחות לליהי רק כשתפתחי וואטסאפ.</p></div></section>

    <section class="section faq-section wrap" id="faq">${heading('A LITTLE MORE CLARITY', 'שאלות נפוצות', 'כל מה שרצית לדעת, לפני שנפגשות.')}<div class="faq-list">${faqs.map((faq, i) => `<details class="faq-item"><summary><span class="faq-number" dir="ltr">0${i + 1}</span><span>${faq.question}</span><span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-answer"><p>${faq.answer}</p>${i === 3 ? `<a class="text-link" target="_blank" rel="noopener noreferrer" href="${escape(whatsappUrl())}">לשליחת הודעה לליהי ${icon('arrow')}</a>` : ''}</div></details>`).join('')}</div></section>

    <section class="closing-section" id="contact"><div class="closing-line" aria-hidden="true"></div><div class="wrap"><span class="eyebrow" lang="en" dir="ltr">GOOD SKIN STARTS WITH A CONVERSATION</span><h2>העור שלך ראוי לטיפול<br>שמתאים בדיוק לו.</h2><p>הצעד הראשון הוא פשוט להכיר.</p>${cta('בואי נדבר בוואטסאפ', 'היי ליהי, אשמח להתייעץ ולתאם מפגש בקליניקה.')}</div><span class="closing-leaf" aria-hidden="true">${icon('leaf')}</span></section>
  </main>
  <footer class="site-footer wrap"><div class="footer-top"><a class="brand-link" href="#home" aria-label="LIHI SKIN STUDIO — לראש הדף">${brand()}</a><span class="footer-name">${business.name}<small>טיפולי פנים בהתאמה אישית</small></span><div class="footer-contact">${business.locationConfirmed ? `<span>${icon('pin')}${escape(business.location)}</span>` : ''}<a href="tel:${business.phone}">${icon('phone')}<span dir="ltr">${business.displayPhone}</span></a>${business.instagram ? `<a href="${escape(business.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>` : ''}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${business.name}. כל הזכויות שמורות.</span><div>${business.privacyUrl ? `<a href="${escape(business.privacyUrl)}">מדיניות פרטיות</a>` : `<button class="privacy-button">פרטיות באתר</button>`}<a href="#home">בחזרה למעלה ↑</a></div><span class="footer-note" lang="en" dir="ltr">PERSONAL CARE. PERSONAL ATTENTION.</span></div></footer>
  <div class="mobile-sticky">${cta('לתיאום טיפול בוואטסאפ')}</div>
  <dialog id="media-dialog" class="lightbox"><div class="lightbox-top"><h2 id="lightbox-title"></h2><button class="icon-button close-dialog" aria-label="סגירה">${icon('close')}</button></div><div id="lightbox-content"></div><p class="lightbox-caption"></p></dialog>
  <dialog id="privacy-dialog" class="privacy-dialog"><div class="lightbox-top"><h2>פרטיות באתר</h2><button class="icon-button close-dialog" aria-label="סגירה">${icon('close')}</button></div><p>השאלון פועל בדפדפן בלבד. התשובות אינן נשמרות באתר ואינן נשלחות לשרת.</p><p>לחיצה על כפתור הוואטסאפ פותחת את שירות WhatsApp עם טיוטת הודעה המכילה את הבחירות שלך. שליחת ההודעה מתבצעת רק על ידך, בכפוף למדיניות השירות.</p><p>האתר אינו משתמש בכלי ניתוח, עוגיות מעקב או טפסי איסוף מידע.</p><p>לבירור נוסף ניתן לפנות לליהי במספר <a href="tel:${business.phone}" dir="ltr">${business.displayPhone}</a>.</p></dialog>
`;

// Missing or damaged media returns to the designed placeholder without layout shifts.
document.addEventListener('error', event => {
  if (!event.target.matches?.('.media img, .media video, .media source')) return;
  const container = event.target.closest('.media');
  const id = container.dataset.mediaId;
  mediaById[id].placeholder = true;
  container.outerHTML = media(id, container.className.replace(/has-asset/g, ''));
}, true);

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.innerHTML = icon('menu'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.innerHTML = icon(open ? 'close' : 'menu'); });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.composedPath().includes(document.querySelector('.site-header'))) closeMenu(); });

let activeResult = 0;
function bindCompare() {
  document.querySelector('.compare-range').addEventListener('input', event => {
    event.target.closest('.comparison').style.setProperty('--split', `${event.target.value}%`);
    event.target.setAttribute('aria-valuetext', `${event.target.value} אחוז לפני ו־${100 - event.target.value} אחוז אחרי`);
  });
}
function showResult(index) {
  activeResult = (index + results.length) % results.length;
  document.querySelector('.result-stage').innerHTML = `${resultMarkup(activeResult)}<span class="slider-hint">${icon('arrow')} גררי כדי להשוות בין לפני ואחרי</span>`;
  document.querySelector('.result-description').innerHTML = `<h3>${results[activeResult].title}</h3><p>${results[activeResult].text}</p>`;
  document.querySelectorAll('[data-result]').forEach((dot, i) => { dot.classList.toggle('is-active', i === activeResult); dot.setAttribute('aria-pressed', String(i === activeResult)); });
  bindCompare();
}
bindCompare();
document.querySelector('.result-next').addEventListener('click', () => showResult(activeResult + 1));
document.querySelector('.result-prev').addEventListener('click', () => showResult(activeResult - 1));
document.querySelectorAll('[data-result]').forEach(dot => dot.addEventListener('click', () => showResult(Number(dot.dataset.result))));

const reviewTrack = document.querySelector('.review-track');
const reviewCards = [...reviewTrack.children];
let activeReview = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function reviewLastPage() { return Math.max(0, Math.ceil((reviewTrack.scrollWidth - reviewTrack.clientWidth) / (reviewCards[0].offsetWidth + 20) - 0.01)); }
function updateReviewDots() {
  document.querySelectorAll('[data-review]').forEach((dot, i) => { dot.hidden = i > reviewLastPage(); dot.classList.toggle('is-active', i === activeReview); dot.setAttribute('aria-pressed', String(i === activeReview)); });
}
function showReview(index) {
  activeReview = (index + reviewLastPage() + 1) % (reviewLastPage() + 1);
  reviewTrack.scrollTo({ left: -activeReview * (reviewCards[0].offsetWidth + 20), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  updateReviewDots();
}
document.querySelector('.review-next').addEventListener('click', () => showReview(activeReview + 1));
document.querySelector('.review-prev').addEventListener('click', () => showReview(activeReview - 1));
document.querySelectorAll('[data-review]').forEach(dot => dot.addEventListener('click', () => showReview(Number(dot.dataset.review))));
reviewTrack.addEventListener('scroll', () => {
  activeReview = Math.round(Math.abs(reviewTrack.scrollLeft) / (reviewCards[0].offsetWidth + 20));
  updateReviewDots();
}, { passive: true });
new ResizeObserver(() => { activeReview = Math.min(activeReview, reviewLastPage()); updateReviewDots(); }).observe(reviewTrack);
updateReviewDots();

const lightbox = document.querySelector('#media-dialog');
lightbox.setAttribute('aria-labelledby', 'lightbox-title');
document.querySelector('#privacy-dialog').setAttribute('aria-label', 'פרטיות באתר');
document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  const entry = mediaById[button.dataset.lightbox];
  document.querySelector('#lightbox-title').textContent = entry.label;
  document.querySelector('#lightbox-content').innerHTML = media(entry.id, '', { preview: false });
  document.querySelector('.lightbox-caption').textContent = mediaSource(entry.id) ? entry.alt : 'זהו מקום שמור למדיה המקורית של הקליניקה. התוכן יתווסף בהמשך.';
  lightbox.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelector('.privacy-button')?.addEventListener('click', () => { document.querySelector('#privacy-dialog').showModal(); document.body.classList.add('dialog-open'); });
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { dialog.querySelectorAll('video').forEach(video => video.pause()); document.body.classList.remove('dialog-open'); });
});

let quizStep = 0;
const answers = ['', ''];
const quizContent = document.querySelector('#quiz-content');
function renderQuiz(focus = false) {
  const options = quizStep === 0 ? questionnaire.concerns : questionnaire.skinTypes;
  quizContent.innerHTML = `<span class="quiz-count">שאלה ${quizStep + 1} מתוך 2</span><fieldset><legend tabindex="-1">${quizStep === 0 ? 'מה הכי מפריע לך בעור כרגע?' : 'איך היית מתארת את העור שלך?'}</legend><p class="quiz-helper">${quizStep === 0 ? 'בחרי את הנושא שהיית רוצה להתחיל ממנו.' : 'גם אם את לא בטוחה, נוכל להכיר אותו יחד.'}</p><div class="quiz-options">${options.map((option, i) => `<label class="quiz-option"><input type="radio" name="answer" value="${escape(option)}" ${answers[quizStep] === option ? 'checked' : ''} required><span>${icon(quizStep === 0 ? ['spark', 'sun', 'layers', 'drop', 'heart'][i] : ['drop', 'sun', 'layers', 'leaf', 'heart'][i])}<span>${option}</span><span class="radio-circle"></span></span></label>`).join('')}</div></fieldset><div class="quiz-actions">${quizStep === 1 ? '<button type="button" class="quiz-back text-link">חזרה</button>' : ''}${quizStep === 0 ? `<button class="button quiz-next" type="submit" ${answers[0] ? '' : 'disabled'}>המשך ${icon('arrow')}</button>` : `<a class="button quiz-send ${answers[1] ? '' : 'is-disabled'}" ${answers[1] ? `href="${escape(quizUrl())}"` : ''} aria-disabled="${!answers[1]}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')}בואי נמשיך בוואטסאפ ${icon('arrow')}</a>`}</div>`;
  document.querySelectorAll('.quiz-step').forEach((step, i) => { step.classList.toggle('is-active', i === quizStep); step.classList.toggle('is-complete', i < quizStep); });
  quizContent.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
    answers[quizStep] = input.value;
    const next = quizContent.querySelector('.quiz-next');
    if (next) next.disabled = false;
    const send = quizContent.querySelector('.quiz-send');
    if (send) { send.href = quizUrl(); send.setAttribute('aria-disabled', 'false'); send.classList.remove('is-disabled'); }
  }));
  quizContent.querySelector('.quiz-back')?.addEventListener('click', () => { quizStep = 0; renderQuiz(true); });
  if (focus) quizContent.querySelector('legend').focus();
}
function quizUrl() { return whatsappUrl(`היי ליהי, מילאתי את שאלון ההיכרות 🌿\nהנושא שהכי חשוב לי: ${answers[0]}\nסוג העור שלי: ${answers[1]}\nאשמח להתייעץ ולתאם אבחון אישי.`); }
document.querySelector('#skin-quiz').addEventListener('submit', event => { event.preventDefault(); if (answers[quizStep] && quizStep === 0) { quizStep = 1; renderQuiz(true); } });
renderQuiz();

document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('toggle', () => { if (item.open) document.querySelectorAll('.faq-item').forEach(other => { if (other !== item) other.open = false; }); }));
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.desktop-nav a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`)); }), { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
