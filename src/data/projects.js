/**
 * Додаткові роботи для кнопки «Переглянути більше».
 * Додавайте нові об'єкти до additional — верстка і фільтри оновляться автоматично.
 * Перші три обрані роботи залишаються в src/components/Projects.astro.
 * Інструкція та шаблон нового проєкту: PROJECTS.md.
 */
export default {
  initialCount: 3,
  pageSize: 3,
  additional: [
    {
      id: 'orbit',
      name: 'orbit.',
      category: 'app',
      image: '/assets/orbit.svg',
      url: '',
      uk: {
        subtitle: 'Фінанси, в яких усе зрозуміло',
        alt: 'Концепт фінансової панелі Orbit',
        type: 'Вебзастосунок',
        description: 'Концепція фінансового кабінету, який допомагає бачити загальну картину. Графіки, баланс і останні операції зібрано в єдиній системі з чіткою ієрархією. Темна палітра та м’які акценти підтримують фокус на важливому.',
        focus: 'Інтерфейс, візуалізація даних, UX',
        format: 'Фінансова панель',
      },
      en: {
        subtitle: 'Making sense of your finances',
        alt: 'Orbit finance dashboard concept',
        type: 'Web application',
        description: 'A finance dashboard concept designed to help you see the bigger picture. Charts, balances, and recent transactions come together in a coherent system with a clear hierarchy. A dark palette and gentle accents keep the focus where it matters.',
        focus: 'Interface, data visualization, UX',
        format: 'Finance dashboard',
      },
      fr: {
        subtitle: 'Vos finances en toute clarté',
        alt: 'Concept du tableau de bord financier Orbit',
        type: 'Application web',
        description: 'Un concept de tableau de bord financier pour garder une vue d’ensemble. Graphiques, soldes et dernières transactions sont réunis dans une interface cohérente à la hiérarchie claire. Une palette sombre et des accents discrets permettent de se concentrer sur l’essentiel.',
        focus: 'Interface, visualisation des données, UX',
        format: 'Tableau de bord financier',
      },
    },
    {
      id: 'forma',
      name: 'FORMA®',
      category: 'website',
      image: '/assets/forma.svg',
      url: '', // Посилання на готовий сайт. Порожнє значення відкриває опис концепту.
      uk: {
        subtitle: 'Простір для гарної архітектури',
        alt: 'Концепт сайту архітектурної студії FORMA',
        type: 'Вебсайт',
        description: 'Візуальна концепція сайту архітектурної студії. Спокійна палітра, виразна типографіка та великі зображення створюють простір, у якому головне — архітектура. Структура об’єднує знайомство зі студією, її підхід та вибрані роботи.',
        focus: 'Артдирекція, типографіка, структура',
        format: 'Сайт архітектурної студії',
      },
      en: {
        subtitle: 'A space for good architecture',
        alt: 'FORMA architecture studio website concept',
        type: 'Website',
        description: 'A visual concept for an architecture studio. A calm palette, expressive typography, and generous imagery create a space where the architecture takes center stage. The structure introduces the studio, its philosophy, and a selection of projects.',
        focus: 'Art direction, typography, structure',
        format: 'Architecture studio website',
      },
      fr: {
        subtitle: 'Un espace dédié à l’architecture',
        alt: 'Concept de site du studio d’architecture FORMA',
        type: 'Site web',
        description: 'Un concept visuel pour un studio d’architecture. Une palette douce, une typographie expressive et de grandes images créent un espace où l’architecture est au premier plan. La structure présente le studio, sa philosophie et une sélection de projets.',
        focus: 'Direction artistique, typographie, structure',
        format: 'Site de studio d’architecture',
      },
    },
    {
      id: 'kseniia-savchuk',
      name: 'Kseniia Savchuk',
      category: 'website',
      image: '/assets/kseniia-savchuk.jpg',
      url: 'https://photo.ruslan-savchuk-dev-ca.workers.dev/',
      uk: {
        subtitle: 'Сайт фотографки з Калгарі',
        alt: 'Головна сторінка сайту фотографки Kseniia Savchuk у Калгарі',
        type: 'Вебсайт',
      },
      en: {
        subtitle: 'Calgary photographer website',
        alt: 'Homepage of Calgary photographer Kseniia Savchuk',
        type: 'Website',
      },
      fr: {
        subtitle: 'Site d’une photographe à Calgary',
        alt: 'Page d’accueil de Kseniia Savchuk, photographe à Calgary',
        type: 'Site web',
      },
    },
  ],
};
