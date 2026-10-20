# מדריך החלפת מדיה

כל האזורים מוכנים מראש לתמונות ולסרטונים המקוריים. אין צורך לשנות את מבנה הדף.

## התמונות שכבר שולבו

חמש תמונות המקור שסופקו בתיקיית הפרויקט שולבו כך:

| קובץ מקור | מיקום בדף | קובץ לתצוגה |
| --- | --- | --- |
| `תמונת פתיחה ראשית.png` | פתיחה ואודות | `public/media/hero/hero-portrait.webp` |
| אותה תמונת פתיחה | גרסת פתיחה למובייל | `public/media/hero/hero-mobile.webp` |
| `תמונה מקצועית של התעודה.png` | תעודה באזור אודות, עם הגדלה בלחיצה | `public/media/about/certification.webp` |
| `הקלינקה.png` | התמונה הראשית בגלריית הקליניקה | `public/media/clinic/interior.webp` |
| `לפני.png` | הצד שלפני בהשוואה הראשונה | `public/media/results/result-01-before.webp` |
| `אחרי.png` | הצד שאחרי בהשוואה הראשונה | `public/media/results/result-01-after.webp` |

קובצי המקור נשארים ללא שינוי. עותקי WebP מופקים בעזרת `npm run media:prepare`. תמונות לפני/אחרי והתעודה מקודדות ללא אובדן איכות; תמונות הפנים לא עוברות ריטוש, פילטרים או שינוי גודל. הפריסה של ההשוואה הראשונה הותאמה לתמונות לאורך. תמונת האודות משתמשת באותו קובץ של תמונת הפתיחה כדי לחסוך טעינה כפולה. יתר המדיה נשארת במצב מציין מקום.

## הוספת תמונות נוספות

1. הוסיפו את הקובץ לנתיב המדויק בטבלה למטה, תחת `public/media/` (צרו את התיקיות לפי הצורך).
2. ב־`src/media.js`, ברשומה עם ה־ID המתאים, הגדירו `placeholder: false`. אפשר להוסיף את ההגדרה באובייקט האפשרויות של `asset(...)`.
3. עדכנו את `alt` בתיאור עברי קצר ומדויק. אפשר להוסיף אותו לאובייקט האפשרויות. התאימו את `label` לכיתוב הרצוי.
4. הפעילו מחדש את שרת הפיתוח אם התיקייה חדשה, ובצעו `npm run build`. קבצים חסרים אינם נטענים; מציין המקום ימשיך להופיע. גם שגיאת טעינה מחזירה את מציין המקום בלי לשנות את המידות.
5. בדקו את החיתוך במובייל ובדסקטופ. לא נמתח את התמונות: משתמשים ב־`object-fit: cover`.

דוגמה ברשומת תמונת הפתיחה:

```js
asset('hero-portrait', 'פתיחה', 'hero/hero-portrait.webp', 'ליהי פרנס', '4 / 5', '1440 × 1800', {
  tone: 'hero',
  placeholder: false,
  alt: 'ליהי פרנס בקליניקה',
  mobilePath: '/media/hero/hero-mobile.webp',
  mobileDimensions: '900 × 1125',
})
```

תמונת מובייל היא אופציונלית. אם אינה קיימת, תמונת הדסקטופ משמשת גם במובייל. הגודל והיחס ברשומה מתארים את קובץ המקור המומלץ; הפריסה קובעת את חיתוך התצוגה בכל רוחב כדי להתאים לרפרנס. לכל מציין מקום יש `data-media-id` לבדיקת האזור בדפדפן.

## נתיבי הקבצים

כל נתיב בטבלה הוא ביחס לשורש הפרויקט. הרשימה המלאה, כולל חובה/רשות, יחס וסוג, נמצאת גם ב־`docs/media-manifest.json`.

| ID | נתיב | גודל מומלץ | שימוש |
| --- | --- | --- | --- |
| hero-portrait | `public/media/hero/hero-portrait.webp` | 1086 × 1448 | פורטרט פתיחה, שולב |
| גרסת מובייל | `public/media/hero/hero-mobile.webp` | 900 × 1200 | גרסה מותאמת למובייל, שולבה |
| hero-video | `public/media/hero/hero-video.mp4` | 1080 × 1920 | סרטון פתיחה, רשות |
| concern-acne | `public/media/concerns/acne.webp` | 1000 × 800 | אקנה ופצעונים |
| concern-pigmentation | `public/media/concerns/pigmentation.webp` | 1000 × 800 | גוון העור |
| concern-texture | `public/media/concerns/texture.webp` | 1000 × 800 | מרקם העור |
| concern-glow | `public/media/concerns/glow.webp` | 1000 × 800 | זוהר ולחות |
| result-01-before / after | `public/media/results/result-01-before.webp`, `result-01-after.webp` | 692 × 808 לפני, 666 × 786 אחרי | תיעוד ראשון, שולב |
| result-02-before / after | `public/media/results/result-02-before.webp`, `result-02-after.webp` | 1200 × 900 לכל תמונה | תיעוד שני |
| result-03-before / after | `public/media/results/result-03-before.webp`, `result-03-after.webp` | 1200 × 900 לכל תמונה | תיעוד שלישי |
| about-portrait | `public/media/hero/hero-portrait.webp` | 1086 × 1448 | אודות, שימוש חוזר בפורטרט שסופק |
| certification | `public/media/about/certification.webp` | 806 × 1006 | תעודה, שולבה |
| treatment-video | `public/media/treatments/treatment-video.mp4` | 1920 × 840 | סרטון טיפול |
| treatment-poster | `public/media/treatments/treatment-video-poster.webp` | 1920 × 840 | פוסטר לסרטון, רשות |
| treatment-detail | `public/media/treatments/treatment-detail.webp` | 1000 × 1250 | מקום שמור לתמונה נוספת, רשות |
| clinic-interior | `public/media/clinic/interior.webp` | 941 × 1672 | חלל הקליניקה, שולב |
| clinic-products | `public/media/clinic/products.webp` | 1200 × 900 | מוצרים |
| clinic-room | `public/media/clinic/treatment-room.webp` | 1200 × 900 | חדר הטיפול |
| clinic-atmosphere | `public/media/clinic/atmosphere.webp` | 1200 × 900 | אווירה |
| clinic-video | `public/media/clinic/treatment-video.mp4` | 1200 × 900 | סרטון בגלריה |
| questionnaire | `public/media/clinic/skin-detail.webp` | 1000 × 1250 | לצד השאלון, רשות |
| review-01-photo עד review-04-photo | `public/media/reviews/review-01-photo.webp` עד `review-04-photo.webp` | 160 × 160 | דיוקן לקוחה, רשות |
| review-01-screenshot עד review-04-screenshot | `public/media/reviews/review-01-screenshot.webp` עד `review-04-screenshot.webp` | 900 × 1200 | צילום חוות דעת מקורית, רשות |

`treatment-detail` מופיע כצילום משלים קטן לצד סרטון הטיפול בדסקטופ. המדיה האופציונלית מופיעה בפריסות או בהקשרים המתאימים.

## סרטונים

השתמשו ב־MP4 מקודד H.264 עם פתיחה מהירה לרשת, ובפוסטר WebP. עדכנו `placeholder: false` גם בסרטון וגם בפוסטר. `posterId` מקשר ביניהם. הסרטונים מוצגים בנגן עם בקרות בחלון המדיה, בלי הפעלה אוטומטית; הם נעצרים בסגירה. בפתיחה, בסרטון הראשי ובגלריה מוצגת תמונת השער כשזמינה. מומלץ קליפ קצר ודחוס, ללא מידע פרטי ברקע.

## תוצאות אמיתיות

הוסיפו זוג תמונות תואם לכל תיעוד, באותה זווית, תאורה, חיתוך וממדים, ורק עם הרשאת פרסום. הגדירו את שתי הרשומות כזמינות. ב־`src/content.js`, עדכנו את `results` בכותרת, תיאור מאושר ומשך התהליך אם ידוע. אל תשתמשו בתמונות המוקאפים או בתוצאות מדומות. הערת ״התמונות יתווספו בהמשך״ נעלמת אוטומטית כאשר שני הקבצים קיימים ומאופשרים.

## חוות דעת

המערך `testimonials` ב־`src/content.js` ריק בכוונה. כשהתקבלו חוות דעת ואישורי פרסום, הוסיפו למשל:

```js
export const testimonials = [{
  name: 'השם שאושר לפרסום',
  text: 'הטקסט המקורי שאושר לפרסום',
  detail: 'מידע משלים שאושר, אם יש',
  photoId: 'review-01-photo', // אופציונלי
  screenshotId: 'review-01-screenshot', // אופציונלי
}];
```

הכרטיסים עוברים אוטומטית ממצייני מקום לתוכן האמיתי. אין להוסיף דירוגים, שמות או ציטוטים מומצאים. אם מוסיפים יותר מארבע חוות דעת עם מדיה, יש להוסיף רשומות למניפסט עם מזהים ייחודיים.

## מידע נוסף להשלמה

שם העסק, מספר הוואטסאפ והטקסטים ניתנים לעריכה ב־`src/content.js`. יש לאשר את העיר והכתובת לפני הפעלת `locationConfirmed`, ואת רשימת הטיפולים והניסוח המדויק של ההכשרה. קישורי Instagram ומדיניות פרטיות יופיעו כשמזינים כתובות מאושרות. עד אז זמין הסבר על התנהגות הפרטיות של האתר עצמו.
