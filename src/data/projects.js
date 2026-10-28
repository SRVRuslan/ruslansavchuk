import spanish from './translations/es.js';
import german from './translations/de.js';
import portuguese from './translations/pt.js';
import italian from './translations/it.js';
import polish from './translations/pl.js';
import arabic from './translations/ar.js';

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
      es: {
        subtitle: spanish.orbitSubtitle, alt: spanish.orbitAlt, type: spanish.application,
        description: spanish.orbitDescription, focus: spanish.orbitFocus, format: spanish.orbitType,
      },
      de: {
        subtitle: german.orbitSubtitle, alt: german.orbitAlt, type: german.application,
        description: german.orbitDescription, focus: german.orbitFocus, format: german.orbitType,
      },
      pt: {
        subtitle: portuguese.orbitSubtitle, alt: portuguese.orbitAlt, type: portuguese.application,
        description: portuguese.orbitDescription, focus: portuguese.orbitFocus, format: portuguese.orbitType,
      },
      it: {
        subtitle: italian.orbitSubtitle, alt: italian.orbitAlt, type: italian.application,
        description: italian.orbitDescription, focus: italian.orbitFocus, format: italian.orbitType,
      },
      pl: {
        subtitle: polish.orbitSubtitle, alt: polish.orbitAlt, type: polish.application,
        description: polish.orbitDescription, focus: polish.orbitFocus, format: polish.orbitType,
      },
      ar: {
        subtitle: arabic.orbitSubtitle, alt: arabic.orbitAlt, type: arabic.application,
        description: arabic.orbitDescription, focus: arabic.orbitFocus, format: arabic.orbitType,
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
      es: {
        subtitle: spanish.formaSubtitle, alt: spanish.formaAlt, type: spanish.website,
        description: spanish.formaDescription, focus: spanish.formaFocus, format: spanish.formaType,
      },
      de: {
        subtitle: german.formaSubtitle, alt: german.formaAlt, type: german.website,
        description: german.formaDescription, focus: german.formaFocus, format: german.formaType,
      },
      pt: {
        subtitle: portuguese.formaSubtitle, alt: portuguese.formaAlt, type: portuguese.website,
        description: portuguese.formaDescription, focus: portuguese.formaFocus, format: portuguese.formaType,
      },
      it: {
        subtitle: italian.formaSubtitle, alt: italian.formaAlt, type: italian.website,
        description: italian.formaDescription, focus: italian.formaFocus, format: italian.formaType,
      },
      pl: {
        subtitle: polish.formaSubtitle, alt: polish.formaAlt, type: polish.website,
        description: polish.formaDescription, focus: polish.formaFocus, format: polish.formaType,
      },
      ar: {
        subtitle: arabic.formaSubtitle, alt: arabic.formaAlt, type: arabic.website,
        description: arabic.formaDescription, focus: arabic.formaFocus, format: arabic.formaType,
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
      es: {
        subtitle: spanish.photoProjectSubtitle,
        alt: 'Página de inicio de Kseniia Savchuk, fotógrafa en Calgary',
        type: spanish.website,
      },
      de: {
        subtitle: german.photoProjectSubtitle,
        alt: 'Startseite von Kseniia Savchuk, Fotografin in Calgary',
        type: german.website,
      },
      pt: {
        subtitle: portuguese.photoProjectSubtitle,
        alt: 'Página inicial de Kseniia Savchuk, fotógrafa em Calgary',
        type: portuguese.website,
      },
      it: {
        subtitle: italian.photoProjectSubtitle,
        alt: 'Pagina iniziale di Kseniia Savchuk, fotografa a Calgary',
        type: italian.website,
      },
      pl: {
        subtitle: polish.photoProjectSubtitle,
        alt: 'Strona główna Kseniia Savchuk, fotografki z Calgary',
        type: polish.website,
      },
      ar: {
        subtitle: arabic.photoProjectSubtitle,
        alt: 'الصفحة الرئيسية للمصورة Kseniia Savchuk في كالغاري',
        type: arabic.website,
      },
    },
  ],
};
