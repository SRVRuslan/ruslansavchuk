# Ruslan Savchuk — RS

Бренд із наданого користувачем зображення: металевий знак RS, ім’я **RUSLAN SAVCHUK** і підпис **WEB DEVELOPER • SOFTWARE ENGINEER**. Усі ці елементи збережені. Повне оригінальне зображення показане без обрізання в секції «Про мене»; у шапці та футері знак поєднано з читабельним HTML-текстом.

## Файли

- `public/assets/rs-brand-original.png` — точна копія оригінального зображення, 1983 × 793 px.
- `public/assets/rs-brand.webp` — оптимізована версія для секції «Про мене», 1983 × 793 px.
- `public/assets/rs-mark.webp` — окремий RS на прозорому тлі для шапки та футера, 640 × 364 px.
- `public/assets/rs-favicon.png` — квадратна іконка вкладки й Apple Touch Icon, 512 × 512 px.

Логотип підключено в `src/components/BrandLogo.astro`, назва й професія налаштовуються в `src/data/config.js`, кольори — у `src/styles/theme.css`. Основний акцент: `#64b5ff`; фон: `#080d15`.

## Підготовка знака

Для відокремлення RS від фону використано вбудований **imagegen**, режим редагування, прозоре тло. Джерело: «Металевий логотип RS у кіберстилі.png», надане користувачем. Оригінал збережено окремо. WebP і favicon отримано зменшенням та оптимізацією готових зображень.

Точний промпт:

```text
Use case: background-extraction.
Asset type: exact existing personal-brand RS monogram, transparent website header logo and favicon source.
Input image: edit target, supplied by user. Extract ONLY the large connected metallic silver and electric blue RS symbol from the top central portion of the image. Remove all background, the full name, subtitle, floor and long horizontal lens flare lines. Preserve the precise original letter outlines, arrangement, proportions, metallic brushed chrome gradients and the vivid electric blue diagonal part. This is an extraction of the user's actual monogram, not a new logo. Preserve recognizability exactly. Keep subtle blue light on the symbol edges only. Center the symbol on a genuinely transparent background with a tight, even transparent margin, no text, no shadows extending far beyond the mark, no added elements. Landscape compact mark aspect ratio about 1.8:1.
```
