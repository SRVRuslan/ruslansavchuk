# Ruslan Savchuk — RS

Бренд із наданого користувачем зображення: металевий знак RS, ім’я **RUSLAN SAVCHUK** і підпис **WEB DEVELOPER • SOFTWARE ENGINEER**. Усі ці елементи збережені. Повне оригінальне зображення показане без обрізання в секції «Про мене»; у шапці та футері знак поєднано з читабельним HTML-текстом.

## Файли

- `public/assets/rs-brand-original.png` — точна копія оригінального зображення, 1983 × 793 px.
- `public/assets/rs-brand.webp` — оптимізована версія для секції «Про мене», 1983 × 793 px.
- `public/assets/rs-mark.webp` — окремий RS на прозорому тлі для шапки та футера, 640 × 364 px.
- `public/assets/rs-favicon-transparent.png` — попереднє прозоре джерело, 512 × 512 px, без непрозорих смуг зверху та знизу.
- `public/assets/rs-favicon-v4.png` — поточне джерело, 512 × 512 px, зі збільшеним RS і мінімальними бічними відступами.
- `public/assets/rs-favicon-v4-16.png` та `rs-favicon-v4-32.png` — іконки вкладки у відповідних розмірах; версія в назві файлу оновлює адресу для браузерного кешу.
- `public/favicon-v4.ico` — прозорий ICO з розмірами 16, 32, 48, 64, 128 і 256 px; `public/favicon.ico` — така сама іконка за стандартною резервною адресою.
- `public/apple-touch-icon-v4.png` — прозорий Apple Touch Icon, 180 × 180 px; також доступний за стандартними адресами `/apple-touch-icon.png` та `/apple-touch-icon-precomposed.png`.
- `public/assets/rs-favicon.png` — стара публічна адреса, що тепер також повертає чистий прозорий файл. Попередня версія зі смугами залишається в історії Git.

Логотип підключено в `src/components/BrandLogo.astro`, назва й професія налаштовуються в `src/data/config.js`, кольори — у `src/styles/theme.css`. Основний акцент: `#64b5ff`; фон: `#080d15`.

## Підготовка знака

Для відокремлення RS від фону використано вбудований **imagegen**, режим редагування, прозоре тло. Джерело: «Металевий логотип RS у кіберстилі.png», надане користувачем. Оригінал збережено окремо. WebP і favicon отримано зменшенням та оптимізацією готових зображень.

Точний промпт:

```text
Use case: background-extraction.
Asset type: exact existing personal-brand RS monogram, transparent website header logo and favicon source.
Input image: edit target, supplied by user. Extract ONLY the large connected metallic silver and electric blue RS symbol from the top central portion of the image. Remove all background, the full name, subtitle, floor and long horizontal lens flare lines. Preserve the precise original letter outlines, arrangement, proportions, metallic brushed chrome gradients and the vivid electric blue diagonal part. This is an extraction of the user's actual monogram, not a new logo. Preserve recognizability exactly. Keep subtle blue light on the symbol edges only. Center the symbol on a genuinely transparent background with a tight, even transparent margin, no text, no shadows extending far beyond the mark, no added elements. Landscape compact mark aspect ratio about 1.8:1.
```

## Прозорий favicon

Для поточної іконки використано вбудований **imagegen**, режим редагування з прозорим фоном, джерело — `public/assets/rs-favicon.png`. Результат зменшено до 512 × 512 px зі збереженням alpha. Нове ім’я файлу дозволяє браузерам завантажити виправлення замість кешованої іконки.

Під час повторного виправлення кешування 2026-10-26 малюнок не змінювався: готовий прозорий файл зменшено через `sips` до 16, 32 і 180 px та упаковано в ICO через Pillow. HTML використовує нові назви з `v3`; стару публічну PNG-адресу замінено прозорим джерелом, а стандартні резервні адреси додано в корінь сайту.

Точний промпт:

```text
Use case: background-extraction. Asset type: replacement browser favicon for an existing website. Input image: EDIT TARGET, the existing square RS favicon. Primary request: remove ONLY the opaque dark navy horizontal padding bands along the full top and bottom edges, replacing those bands with genuine transparent alpha. Keep the existing RS logo precisely unchanged, with its exact silver metallic letter shapes, blue diagonal, texture, glow, colors, dimensions, position and proportions. Keep all already transparent pixels transparent. Preserve the square canvas and original framing with the logo centered, including transparent padding above and below; do not enlarge, move, crop, reinterpret or redraw the logo. No background rectangle, no added border, no text, no new elements. Output a genuinely transparent PNG favicon.
```

## Збільшена іконка v4

Вбудований imagegen збільшив знак із попереднього прозорого джерела, зберігши пропорції та прозорість. Видима ширина RS збільшилася приблизно з 86% до 98% полотна, тобто приблизно на 15%. Результат зменшено через `sips` до 512, 180, 32 і 16 px та упаковано в ICO через Pillow. Іконки v3 збережено як попередню версію; HTML використовує нові адреси v4, стандартні резервні адреси оновлено.

Точний промпт (вбудований режим):

```text
Use case: precise-object-edit. Asset type: browser favicon, transparent square PNG. Input image: EDIT TARGET, the existing silver and blue RS brand monogram. Only change the framing and scale: uniformly enlarge the existing RS mark until its clearly visible outer letter contours occupy approximately 98 percent of the square canvas width, with a very narrow even transparent margin on the left and right, and vertically center the visible logo. Remove excess empty padding and any detached near-invisible pixels that prevent fitting the actual mark. Preserve the exact connected RS letter shapes, their original aspect ratio, silver metal shading, electric blue diagonal, and recognizable design. Do not stretch or reshape the mark, do not crop any part of the letters, do not add elements, text, borders, or background. Keep the entire background genuinely transparent, including above/below and inside the letter openings. No black or colored horizontal padding bands. Output a crisp square PNG, optimized for legibility when reduced to a 16px browser tab icon.
```
