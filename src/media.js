const asset = (id, section, path, label, ratio, dimensions, options = {}) => ({
  id, section, path: `/media/${path}`, label, alt: label, type: 'image', ratio, dimensions,
  required: true, placeholder: true, tone: 'sand', ...options,
});

export const mediaManifest = [
  asset('hero-portrait', 'פתיחה', 'hero/hero-portrait.webp', 'ליהי פרנס', '3 / 4', '1086 × 1448', { placeholder: false, alt: 'ליהי פרנס מחזיקה תכשיר טיפוח מקצועי', tone: 'hero', mobilePath: '/media/hero/hero-mobile.webp', mobileDimensions: '900 × 1200' }),
  asset('hero-video', 'פתיחה', 'hero/hero-video.mp4', 'רגע מהקליניקה', '9 / 16', '1080 × 1920', { type: 'video', required: false, posterId: 'hero-portrait' }),
  ...['acne', 'pigmentation', 'texture', 'glow'].map((id, i) => asset(`concern-${id}`, 'נושאי טיפול', `concerns/${id}.webp`, ['אקנה ופצעונים', 'גוון העור', 'מרקם העור', 'זוהר ולחות'][i], '5 / 4', '1000 × 800', { tone: ['clay', 'sand', 'stone', 'blue'][i] })),
  ...['01', '02', '03'].flatMap(id => ['before', 'after'].map(side => asset(`result-${id}-${side}`, 'תוצאות', `results/result-${id}-${side}.webp`, `תוצאה ${id} — ${side === 'before' ? 'לפני' : 'אחרי'}`, id === '01' ? '6 / 7' : '4 / 3', id === '01' ? (side === 'before' ? '692 × 808' : '666 × 786') : '1200 × 900', { placeholder: id !== '01', alt: `תיעוד העור ${side === 'before' ? 'לפני' : 'אחרי'} הטיפול — מבט מהצד`, tone: 'stone', consentRequired: true }))),
  asset('about-portrait', 'אודות', 'hero/hero-portrait.webp', 'ליהי, במבט אישי', '3 / 4', '1086 × 1448', { placeholder: false, alt: 'ליהי פרנס בפורטרט מקצועי', tone: 'clay' }),
  asset('certification', 'אודות', 'about/certification.webp', 'תעודת ההכשרה', '4 / 5', '806 × 1006', { placeholder: false, alt: 'תעודת סיום תוכנית Advanced P.M.E של ליהי פרנס מטעם חוה זינגבוים', tone: 'paper' }),
  asset('treatment-video', 'חוויית הטיפול', 'treatments/treatment-video.mp4', 'הצצה לחוויית הטיפול', '16 / 7', '1920 × 840', { type: 'video', posterId: 'treatment-poster', tone: 'blue' }),
  asset('treatment-poster', 'חוויית הטיפול', 'treatments/treatment-video-poster.webp', 'תמונת שער לסרטון הטיפול', '16 / 7', '1920 × 840', { required: false }),
  asset('treatment-detail', 'חוויית הטיפול', 'treatments/treatment-detail.webp', 'הפרטים הקטנים של הטיפול', '4 / 5', '1000 × 1250', { required: false }),
  asset('clinic-interior', 'גלריה', 'clinic/interior.webp', 'מרחב של שקט', '9 / 16', '941 × 1672', { placeholder: false, alt: 'חדר הטיפול בקליניקה עם מיטת טיפול, מגבות, תאורה ותכשירי טיפוח', tone: 'sand' }),
  asset('clinic-products', 'גלריה', 'clinic/products.webp', 'טיפוח עם מחשבה', '4 / 3', '1200 × 900', { tone: 'paper' }),
  asset('clinic-room', 'גלריה', 'clinic/treatment-room.webp', 'מקום לעצמך', '4 / 3', '1200 × 900', { tone: 'stone' }),
  asset('clinic-atmosphere', 'גלריה', 'clinic/atmosphere.webp', 'יופי בפרטים הקטנים', '4 / 3', '1200 × 900', { tone: 'clay' }),
  asset('clinic-video', 'גלריה', 'clinic/treatment-video.mp4', 'רגע מתוך הטיפול', '4 / 3', '1200 × 900', { type: 'video', posterId: 'treatment-poster', tone: 'blue' }),
  asset('questionnaire', 'שאלון', 'clinic/skin-detail.webp', 'להכיר את העור שלך', '4 / 5', '1000 × 1250', { required: false, tone: 'clay' }),
  ...['01', '02', '03', '04'].flatMap(id => [
    asset(`review-${id}-photo`, 'חוות דעת', `reviews/review-${id}-photo.webp`, 'תמונת לקוחה באישור פרסום', '1 / 1', '160 × 160', { required: false, consentRequired: true }),
    asset(`review-${id}-screenshot`, 'חוות דעת', `reviews/review-${id}-screenshot.webp`, 'חוות דעת מקורית מאושרת', '3 / 4', '900 × 1200', { required: false, consentRequired: true }),
  ]),
];

export const mediaById = Object.fromEntries(mediaManifest.map(item => [item.id, item]));
// Vite discovers actual files only: no requests are sent for absent assets.
const available = import.meta.glob('/public/media/**/*', { eager: true, query: '?url', import: 'default' });
export function mediaSource(id, mobile = false) {
  const entry = mediaById[id];
  if (!entry || entry.placeholder) return null;
  const path = mobile && entry.mobilePath ? entry.mobilePath : entry.path;
  return available[`/public${path}`] ? path : null;
}
