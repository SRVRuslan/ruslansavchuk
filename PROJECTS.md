# Як додати проєкт

Три головні роботи розміщені в `src/components/Projects.astro`. Усі наступні додавайте до масиву `additional` у `src/data/projects.js`: вони автоматично з’являться через кнопку «Переглянути більше».

1. Покладіть прев’ю сайту до папки `public/assets` (наприклад, `my-project.webp`). У посиланнях використовуйте `/assets/my-project.webp`.
2. Скопіюйте об’єкт нижче в кінець масиву `additional`, після попереднього об’єкта та коми.
3. Заповніть назву, посилання та тексти вісьмома мовами: українською, англійською, французькою, іспанською, німецькою, португальською, італійською та польською. Оновіть сторінку в браузері.

```js
{
  id: 'my-project', // Унікальний ID: малі латинські літери, цифри, дефіси.
  name: 'Назва проєкту',
  category: 'website', // 'website' — сайт або магазин; 'app' — вебзастосунок.
  image: '/assets/my-project.webp',
  url: 'https://example.com', // Замініть реальною адресою вашого сайту.
  uk: {
    subtitle: 'Короткий опис українською',
    alt: 'Прев’ю сайту «Назва проєкту»',
    type: 'Вебсайт',
  },
  en: {
    subtitle: 'A short description in English',
    alt: 'Preview of the project website',
    type: 'Website',
  },
  fr: {
    subtitle: 'Une courte description en français',
    alt: 'Aperçu du site du projet',
    type: 'Site web',
  },
  es: {
    subtitle: 'Una breve descripción en español',
    alt: 'Vista previa del sitio del proyecto',
    type: 'Sitio web',
  },
  de: {
    subtitle: 'Eine kurze Beschreibung auf Deutsch',
    alt: 'Vorschau der Projektwebsite',
    type: 'Website',
  },
  pt: {
    subtitle: 'Uma breve descrição em português',
    alt: 'Pré-visualização do site do projeto',
    type: 'Site',
  },
  it: {
    subtitle: 'Una breve descrizione in italiano',
    alt: 'Anteprima del sito del progetto',
    type: 'Sito web',
  },
  pl: {
    subtitle: 'Krótki opis po polsku',
    alt: 'Podgląd strony projektu',
    type: 'Strona internetowa',
  },
},
```

Завершений проєкт із `url` відкривається в новій вкладці та отримує позначку «Реалізований проєкт». Для дизайн-концепту залиште `url: ''` і додайте до `uk`, `en`, `fr`, `es`, `de`, `pt`, `it` та `pl` поля `description`, `focus` та `format`, як у FORMA. Натискання відкриватиме вікно з описом.

Порядок об’єктів визначає порядок додаткових робіт. Щоб прибрати FORMA, видаліть її об’єкт із масиву.

На початку `src/data/projects.js` можна змінити:

- `initialCount: 3` — скільки робіт показувати спочатку в кожній категорії.
- `pageSize: 3` — скільки наступних робіт відкривати за одне натискання.

Фільтри враховують усі роботи, включно з прихованими. Коли показані всі роботи вибраної категорії, кнопка зникає. Лічильник і прогрес оновлюються автоматично. Перемикання мови зберігає поточний фільтр і кількість відкритих робіт.

Під час розробки запускайте `npm run dev`. Після редагування для публікації виконайте `npm run build` і завантажте вміст `dist/` на хостинг.
