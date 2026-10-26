import config from '../data/config.js';
import projectSettings from '../data/projects.js';
import spanish from '../data/translations/es.js';
import german from '../data/translations/de.js';
import portuguese from '../data/translations/pt.js';
import { LANGUAGE_PREFERENCE_KEY, detectBrowserLanguage, resolveInitialLanguage } from './language-preference.js';

(() => {
  'use strict';

  const translations = {
    uk: {
      pageTitle: 'Веброзробник — сайти з характером',
      pageDescription: 'Незалежний веброзробник. Продумані сайти, інтернет-магазини та вебзастосунки — від першої ідеї до запуску.',
      skip: 'Перейти до вмісту', navigation: 'Основна навігація', mobileNavigation: 'Мобільна навігація',
      navWork: 'Роботи', navServices: 'Послуги', navAbout: 'Про мене', letsTalk: 'Зв’яжіться з нами',
      languageLabel: 'Мова сайту', openMenu: 'Відкрити меню', closeMenu: 'Закрити меню',
      availability: 'Беру нові проєкти',
      heroLine1: 'Сучасні сайти.', heroLine2: 'Для бізнесу.',
      heroDescription: 'Створюю швидкі, стильні сайти, які презентують ваш бізнес, викликають довіру та допомагають залучати клієнтів.',
      viewWork: 'Приклади робіт', discussProject: 'Обговорити сайт',
      artSticker: 'Ваш бізнес.<br />Ваш новий сайт.',
      artProcess: 'DESIGN → WEBSITE → LAUNCH', artCaption: 'DESIGNED FOR YOUR BUSINESS',
      previewTagline: 'MADE TO MAKE A DIFFERENCE', previewTitleLine1: 'Good things.', previewTitleLine2: 'Start here.', previewCta: "LET’S MAKE IT HAPPEN",
      brandDeveloper: 'WEB DEVELOPER', brandEngineer: 'SOFTWARE ENGINEER', brandTagline: 'Web Developer · Software Engineer',
      brandImageAlt: 'RS — Ruslan Savchuk. Web Developer · Software Engineer.',
      stripIntro: 'У вашому сайті', strip1: 'Сучасний дизайн', strip2: 'Базове SEO', strip3: 'Соцмережі', strip4: 'Контактна форма',
      workEyebrow: 'ОБРАНІ РОБОТИ', workSide: 'Менше слів. Більше того, що можна побачити.',
      workHeading: 'Різні ідеї. Один підхід.', filterLabel: 'Фільтрувати проєкти', filterAll: 'Усі', filterWeb: 'Вебсайти', filterApp: 'Застосунки',
      concept: 'Дизайн-концепт', website: 'Вебсайт', application: 'Вебзастосунок', photoProjectBadge: 'Реалізований проєкт', photoProjectSubtitle: 'Сайт фотографки з Калгарі', photoProjectLink: 'Відкрити сайт Kseniia Savchuk Photography у новій вкладці',
      careCleanProjectSubtitle: 'Сайт клінінгової компанії в Калгарі',
      careCleanProjectLink: 'Відкрити сайт Care & Clean Home у новій вкладці',
      careCleanProjectAlt: 'Головна сторінка Care & Clean Home — клінінгової компанії в Калгарі',
      mechanicalProjectSubtitle: 'Сайт компанії з опалення та кондиціонування в Калгарі',
      mechanicalProjectLink: 'Відкрити сайт 17 Mechanical у новій вкладці',
      mechanicalProjectAlt: 'Головна сторінка 17 Mechanical — компанії з опалення, вентиляції та кондиціонування в Калгарі',
      roofingProjectSubtitle: 'Сайт покрівельної компанії в Калгарі',
      roofingProjectLink: 'Відкрити сайт Peakline Roofing у новій вкладці',
      roofingProjectAlt: 'Головна сторінка Peakline Roofing — покрівельної компанії в Калгарі',
      roofingArt: 'Створено для Альберти.<br />Створено надовго.',
      formaSubtitle: 'Простір для гарної архітектури', orbitSubtitle: 'Фінанси, в яких усе зрозуміло', bloomSubtitle: 'Онлайн-магазин із живим характером',
      formaAlt: 'Концепт сайту архітектурної студії FORMA', orbitAlt: 'Концепт фінансової панелі Orbit', bloomAlt: 'Концепт магазину кімнатних рослин Bloom',
      bloomArt: 'Трохи природи.<br />Багато життя.',
      conceptNote: 'Реалізовані проєкти й авторські концепти, що демонструють мій підхід до дизайну. Місце для ваших майбутніх історій успіху.',
      servicesEyebrow: 'ЧИМ МОЖУ ДОПОМОГТИ', servicesHeading: 'Ваша мета.<br />Правильне рішення.',
      servicesDescription: 'Не просто сторінки в інтернеті. Інструменти, які знайомлять, переконують і допомагають вашому бізнесу зростати.',
      service1Title: 'Сайти та лендинги', service1Text: 'Виразна перша зустріч із вашим брендом. Зрозуміла структура, сильний дизайн і комфорт на будь-якому екрані.', service1Tag1: 'Лендинги', service1Tag2: 'Корпоративні сайти',
      service2Title: 'Вебзастосунки', service2Text: 'Коли потрібне щось більше. Особисті кабінети, інтерактивні сервіси та інтерфейси, що спрощують складне.', service2Tag1: 'Вебсервіси', service2Tag2: 'Інтеграції',
      service3Title: 'Інтернет-магазини', service3Text: 'Від першого знайомства з товаром до оформлення замовлення. Зручний шлях покупця та увага до кожної деталі.', service3Tag2: 'Каталоги',
      service3Tag1: 'E-commerce',
      aboutNote: 'Трохи допитливості.<br />Багато уваги.', aboutEyebrow: 'ТРОХИ ПРО МЕНЕ', aboutHeading: 'Людина за кодом.<br />Партнер у вашій ідеї.',
      aboutText1: 'Привіт! Я веброзробник, якому однаково важливі те, як сайт виглядає, і те, як він працює. Люблю перетворювати складні задачі на прості та зрозумілі рішення.',
      aboutText2: 'Занурююся у вашу ідею, ставлю запитання та працюю з вами напряму. Щоб кожне рішення мало сенс, а результат відчувався вашим.',
      mainStack: 'Головний стек',
      namedIntroduction: 'Привіт! Я {name}, веброзробник, якому однаково важливі те, як сайт виглядає, і те, як він працює. Люблю перетворювати складні задачі на прості та зрозумілі рішення.',
      value1: 'Пряма комунікація', value2: 'Увага до вашого бізнесу', value3: 'Прозорий процес', value4: 'Турбота про результат', getAcquainted: 'Познайомимося ближче',
      processEyebrow: 'ЯК МИ ПРАЦЮЄМО', processSide: 'Ви завжди знаєте, що відбувається.', processHeading: 'Від розмови до «вау, це моє».',
      step1Title: 'Знайомимося', step1Text: 'Обговорюємо ідею, аудиторію та цілі. Визначаємо обсяг роботи, терміни й бюджет.',
      step2Title: 'Проєктуємо', step2Text: 'Будуємо структуру та знаходимо візуальну мову. Узгоджуємо дизайн до початку розробки.',
      step3Title: 'Розробляємо', step3Text: 'Перетворюємо дизайн на живий сайт. Показую проміжні результати й враховую ваш відгук.',
      step4Title: 'Запускаємо', step4Text: 'Перевіряємо деталі, публікуємо сайт і розбираємося з керуванням. Ваша ідея вже онлайн.',
      faqEyebrow: 'ПЕРЕД СТАРТОМ', faqHeading: 'Можливо, ви<br /> хочете знати.',
      faq1Question: 'Скільки коштує розробка сайту?', faq1Answer: 'Вартість залежить від обсягу, дизайну та функцій. Після короткого знайомства з вашим завданням я підготую пропозицію з конкретним переліком робіт і бюджетом.',
      faq2Question: 'Скільки часу займає проєкт?', faq2Answer: 'Терміни визначаємо разом після обговорення задачі. На них впливають кількість сторінок, складність функцій і готовність матеріалів. Перед стартом у вас буде зрозумілий план із ключовими етапами.',
      faq3Question: 'Чи можна звернутися лише з ідеєю?', faq3Answer: 'Так. Не обов’язково мати готове технічне завдання. Розкажіть, для кого ваш продукт і чого хочете досягти — разом визначимо структуру, функції та наступні кроки.',
      faq4Question: 'Що відбувається після запуску?', faq4Answer: 'Передаю файли й доступи та пояснюю, як працювати із сайтом. Потребу в подальшій підтримці, оновленнях і нових функціях можемо обговорити окремо.',
      contactEyebrow: 'НАСТУПНИЙ ПРОЄКТ — ВАШ?', contactHeading: 'Зробімо щось<br />класне<span class="contact-period">.</span>',
      contactDescription: 'Велика ідея чи маленький початок — усе починається з розмови. Розкажіть, що маєте на думці.', contactNote: 'Хороші проєкти починаються з «привіт».',
      nameLabel: 'Ваше ім’я', namePlaceholder: 'Як до вас звертатися?', emailLabel: 'Електронна пошта', interestLabel: 'Що вас цікавить?',
      interestWebsite: 'Вебсайт', interestApp: 'Вебзастосунок', interestShop: 'Інтернет-магазин', interestOther: 'Щось інше',
      messageLabel: 'Який сайт вам потрібен?', messagePlaceholder: 'Наприклад: сайт для кав’ярні з меню та контактами.',
      formHeading: 'Заявка на сайт', formIntro: 'Розкажіть про сайт — я зв’яжуся з вами.', formExtrasLabel: 'Обрати тип проєкту',
      phoneLabel: 'Номер телефону (необов’язково)', phonePlaceholder: 'Номер у зручному для вас форматі',
      formNote: 'Відповім особисто на ваш email.',
      submitSend: 'Відправити заявку', submitSending: 'Відправляємо…',
      formSent: 'Дякую! Вашу заявку відправлено. Я зв’яжуся з вами найближчим часом.',
      formError: 'Не вдалося відправити заявку. Спробуйте ще раз або напишіть мені на пошту. Ваші дані збережено у формі.',
      formRateLimited: 'Забагато спроб. Зачекайте хвилину та спробуйте ще раз.',
      requiredField: 'Будь ласка, заповніть це поле.', invalidEmail: 'Введіть коректну електронну адресу.', shortMessage: 'Опишіть ідею хоча б у 10 символах.',
      footerTagline: 'Продумано. Розроблено. З любов’ю до деталей.', backTop: 'Нагору', rights: 'Усі права захищено.', footerCredit: 'СТВОРЕНО ТА РОЗРОБЛЕНО',
      footerNavigation: 'Навігація у футері', footerNavigationHeading: 'Навігація',
      footerConnect: 'Будьмо на зв’язку', footerSocialCaption: 'Напишіть мені — обговорімо ваш проєкт.',
      emailLinkLabel: 'Написати листа',
      socialProfileLabel: '{name} — відкрити в новій вкладці',
      closeProject: 'Закрити опис проєкту', projectFocus: 'ФОКУС', projectType: 'ФОРМАТ',
      projectDisclaimer: 'Це демонстраційна концепція, створена для цього портфоліо, а не запущений клієнтський проєкт.', wantSimilar: 'Обговорити подібний проєкт',
      projectsShown: 'Показано {count} із {total} проєктів', viewMoreProjects: 'Переглянути більше',
      openProjectSite: 'Відкрити сайт {name} у новій вкладці', homeLabel: 'На головну',
      formaDescription: 'Візуальна концепція сайту архітектурної студії. Спокійна палітра, виразна типографіка та великі зображення створюють простір, у якому головне — архітектура. Структура об’єднує знайомство зі студією, її підхід та вибрані роботи.',
      formaFocus: 'Артдирекція, типографіка, структура', formaType: 'Сайт архітектурної студії',
      orbitDescription: 'Концепція фінансового кабінету, який допомагає бачити загальну картину. Графіки, баланс і останні операції зібрано в єдиній системі з чіткою ієрархією. Темна палітра та м’які акценти підтримують фокус на важливому.',
      orbitFocus: 'Інтерфейс, візуалізація даних, UX', orbitType: 'Фінансова панель',
      bloomDescription: 'Концепція магазину кімнатних рослин із теплим природним настроєм. Великі картки товарів, прості категорії та спокійні кольори допомагають зосередитися на виборі. Візуальна мова поєднує редакційну типографіку та ботанічну графіку.',
      bloomFocus: 'Каталог, картки товарів, візуальний стиль', bloomType: 'Інтернет-магазин рослин',
    },
    en: {
      pageTitle: 'Web developer — websites with character',
      pageDescription: 'Independent web developer. Thoughtful websites, online stores and web applications — from the first idea to launch.',
      skip: 'Skip to content', navigation: 'Main navigation', mobileNavigation: 'Mobile navigation',
      navWork: 'Work', navServices: 'Services', navAbout: 'About', letsTalk: 'Contact Us',
      languageLabel: 'Website language', openMenu: 'Open menu', closeMenu: 'Close menu',
      availability: 'Available for projects',
      heroLine1: 'Modern sites.', heroLine2: 'For your business.',
      heroDescription: 'I create fast, stylish websites that showcase your business, build trust and help attract customers.',
      viewWork: 'View work', discussProject: 'Discuss your site',
      artSticker: 'Your business.<br />Your new website.',
      artProcess: 'DESIGN → WEBSITE → LAUNCH', artCaption: 'DESIGNED FOR YOUR BUSINESS',
      previewTagline: 'MADE TO MAKE A DIFFERENCE', previewTitleLine1: 'Good things.', previewTitleLine2: 'Start here.', previewCta: "LET’S MAKE IT HAPPEN",
      brandDeveloper: 'WEB DEVELOPER', brandEngineer: 'SOFTWARE ENGINEER', brandTagline: 'Web Developer · Software Engineer',
      brandImageAlt: 'RS — Ruslan Savchuk. Web Developer · Software Engineer.',
      stripIntro: 'Your site includes', strip1: 'Modern design', strip2: 'Basic SEO', strip3: 'Social links', strip4: 'Contact form',
      workEyebrow: 'SELECTED WORK', workSide: 'Less talking. More showing.',
      workHeading: 'Different ideas. Same care.', filterLabel: 'Filter projects', filterAll: 'All work', filterWeb: 'Websites', filterApp: 'Web apps',
      concept: 'Design concept', website: 'Website', application: 'Web application', photoProjectBadge: 'Launched project', photoProjectSubtitle: 'Calgary photographer website', photoProjectLink: 'Open the Kseniia Savchuk Photography website in a new tab',
      careCleanProjectSubtitle: 'Cleaning company website in Calgary',
      careCleanProjectLink: 'Open the Care & Clean Home website in a new tab',
      careCleanProjectAlt: 'Care & Clean Home homepage — a cleaning company in Calgary',
      mechanicalProjectSubtitle: 'Heating and air conditioning company website in Calgary',
      mechanicalProjectLink: 'Open the 17 Mechanical website in a new tab',
      mechanicalProjectAlt: '17 Mechanical homepage — a heating, ventilation and air conditioning company in Calgary',
      roofingProjectSubtitle: 'Roofing company website in Calgary',
      roofingProjectLink: 'Open the Peakline Roofing website in a new tab',
      roofingProjectAlt: 'Peakline Roofing homepage — a roofing company in Calgary',
      roofingArt: 'Built for Alberta.<br />Built to last.',
      formaSubtitle: 'A space for good architecture', orbitSubtitle: 'Making sense of your finances', bloomSubtitle: 'An online store with a little more life',
      formaAlt: 'FORMA architecture studio website concept', orbitAlt: 'Orbit finance dashboard concept', bloomAlt: 'Bloom houseplant store concept',
      bloomArt: 'A little nature.<br />A lot of life.',
      conceptNote: 'Launched projects and original concepts that show my approach to design. Making room for your next success story.',
      servicesEyebrow: 'WHAT I CAN HELP WITH', servicesHeading: 'Your ambition.<br />The right solution.',
      servicesDescription: 'More than pages on the internet. Tools that introduce, inspire confidence, and help your business grow.',
      service1Title: 'Websites & landing pages', service1Text: 'A memorable first hello from your brand. Clear structure, considered design, and a great experience on every screen.', service1Tag1: 'Landing pages', service1Tag2: 'Business websites',
      service2Title: 'Web applications', service2Text: 'When you need something more. Customer portals, interactive services, and interfaces that make the complex feel simple.', service2Tag1: 'Web platforms', service2Tag2: 'Integrations',
      service3Title: 'Online stores', service3Text: 'From discovering a product to placing an order. An intuitive shopping journey with care in every detail.', service3Tag2: 'Product catalogs',
      service3Tag1: 'E-commerce',
      aboutNote: 'A little curiosity.<br />A whole lot of care.', aboutEyebrow: 'A LITTLE ABOUT ME', aboutHeading: 'The human behind the code.<br />A partner in your idea.',
      aboutText1: 'Hi! I’m a web developer who cares just as much about how a website looks as how it works. I enjoy turning complex challenges into simple, intuitive solutions.',
      aboutText2: 'I get to know your idea, ask questions, and work with you directly. So every decision has a purpose, and the result feels truly yours.',
      mainStack: 'Main stack',
      namedIntroduction: 'Hi! I’m {name}, a web developer who cares just as much about how a website looks as how it works. I enjoy turning complex challenges into simple, intuitive solutions.',
      value1: 'Direct communication', value2: 'Your business in focus', value3: 'A transparent process', value4: 'Care for the outcome', getAcquainted: 'Let’s get to know each other',
      processEyebrow: 'HOW WE WORK TOGETHER', processSide: 'You always know where things stand.', processHeading: 'From “hello” to “that’s so me”.',
      step1Title: 'Get acquainted', step1Text: 'We talk about your idea, audience, and goals. Then define the scope, timeline, and budget.',
      step2Title: 'Shape the idea', step2Text: 'We plan the structure and find a visual language. The design is agreed on before development begins.',
      step3Title: 'Bring it to life', step3Text: 'The design becomes a working website. I share progress along the way and incorporate your feedback.',
      step4Title: 'Ready for takeoff', step4Text: 'We check the details, launch the site, and walk through how to manage it. Your idea is out in the world.',
      faqEyebrow: 'BEFORE WE START', faqHeading: 'You might<br /> be wondering.',
      faq1Question: 'How much does a website cost?', faq1Answer: 'The cost depends on the scope, design, and functionality. After a short conversation about your project, I’ll prepare a proposal with a clear breakdown of the work and budget.',
      faq2Question: 'How long does a project take?', faq2Answer: 'We agree on the timeline after discussing your needs. The number of pages, complexity, and readiness of content all play a part. Before we start, you’ll have a clear plan with key milestones.',
      faq3Question: 'Can I start with just an idea?', faq3Answer: 'Absolutely. You don’t need a finished brief. Tell me who your product is for and what you want to achieve. We’ll work out the structure, features, and next steps together.',
      faq4Question: 'What happens after launch?', faq4Answer: 'I hand over the files and access details, and show you how to work with your website. We can discuss ongoing support, updates, and new features separately.',
      contactEyebrow: 'COULD YOUR PROJECT BE NEXT?', contactHeading: 'Let’s make<br />something great<span class="contact-period">.</span>',
      contactDescription: 'A big idea or a small beginning — it all starts with a conversation. Tell me what you have in mind.', contactNote: 'Good projects start with a simple “hello”.',
      nameLabel: 'Your name', namePlaceholder: 'What should I call you?', emailLabel: 'Email address', interestLabel: 'What do you have in mind?',
      interestWebsite: 'Website', interestApp: 'Web app', interestShop: 'Online store', interestOther: 'Something else',
      messageLabel: 'What website do you need?', messagePlaceholder: 'For example: a café website with a menu and contact details.',
      formHeading: 'Website enquiry', formIntro: 'Tell me about your site — I’ll get back to you.', formExtrasLabel: 'Choose a project type',
      phoneLabel: 'Phone number (optional)', phonePlaceholder: 'Your number in any format you prefer',
      formNote: 'I’ll reply personally by email.',
      submitSend: 'Send enquiry', submitSending: 'Sending…',
      formSent: 'Thank you! Your enquiry has been sent. I’ll get back to you soon.',
      formError: 'Your enquiry could not be sent. Please try again or email me directly. Your details are still in the form.',
      formRateLimited: 'Too many attempts. Please wait a minute and try again.',
      requiredField: 'Please fill out this field.', invalidEmail: 'Please enter a valid email address.', shortMessage: 'Please describe your idea in at least 10 characters.',
      footerTagline: 'Thoughtfully designed. Carefully built. Made with care.', backTop: 'Back to top', rights: 'All rights reserved.', footerCredit: 'CREATED & DEVELOPED BY',
      footerNavigation: 'Footer navigation', footerNavigationHeading: 'Explore',
      footerConnect: 'Stay connected', footerSocialCaption: 'Message me — let’s talk about your project.',
      emailLinkLabel: 'Send an email',
      socialProfileLabel: '{name} — open in a new tab',
      closeProject: 'Close project details', projectFocus: 'FOCUS', projectType: 'FORMAT',
      projectDisclaimer: 'This is a demonstration concept created for this portfolio, rather than a launched client project.', wantSimilar: 'Discuss a similar project',
      projectsShown: 'Showing {count} of {total} projects', viewMoreProjects: 'View more projects',
      openProjectSite: 'Open the {name} website in a new tab', homeLabel: 'Back to home',
      formaDescription: 'A visual concept for an architecture studio. A calm palette, expressive typography, and generous imagery create a space where the architecture takes center stage. The structure introduces the studio, its philosophy, and a selection of projects.',
      formaFocus: 'Art direction, typography, structure', formaType: 'Architecture studio website',
      orbitDescription: 'A finance dashboard concept designed to help you see the bigger picture. Charts, balances, and recent transactions come together in a coherent system with a clear hierarchy. A dark palette and gentle accents keep the focus where it matters.',
      orbitFocus: 'Interface, data visualization, UX', orbitType: 'Finance dashboard',
      bloomDescription: 'A houseplant store concept with a warm, natural feel. Generous product cards, simple categories, and calm colors make browsing feel effortless. The visual language brings together editorial typography and botanical illustrations.',
      bloomFocus: 'Catalog, product cards, visual identity', bloomType: 'Online plant store',
    },
  };

  translations.fr = {
    pageTitle: 'Développeur web — des sites qui ont du caractère',
    pageDescription: 'Développeur web indépendant. Sites web, boutiques en ligne et applications web conçus avec soin — de la première idée au lancement.',
    skip: 'Aller au contenu', navigation: 'Navigation principale', mobileNavigation: 'Navigation mobile',
    navWork: 'Projets', navServices: 'Services', navAbout: 'À propos', letsTalk: 'Contactez-nous',
    languageLabel: 'Langue du site', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu',
    availability: 'Disponible pour vos projets',
    heroLine1: 'Un site moderne.', heroLine2: 'Pour votre activité.',
    heroDescription: 'Je crée des sites rapides et élégants qui présentent votre activité, inspirent confiance et vous aident à attirer des clients.',
    viewWork: 'Voir les projets', discussProject: 'Parlons de votre site',
    artSticker: 'Votre activité.<br />Votre nouveau site.',
    artProcess: 'DESIGN → WEBSITE → LAUNCH', artCaption: 'DESIGNED FOR YOUR BUSINESS',
    previewTagline: 'MADE TO MAKE A DIFFERENCE', previewTitleLine1: 'Good things.', previewTitleLine2: 'Start here.', previewCta: "LET’S MAKE IT HAPPEN",
    brandDeveloper: 'WEB DEVELOPER', brandEngineer: 'SOFTWARE ENGINEER', brandTagline: 'Web Developer · Software Engineer',
    brandImageAlt: 'RS — Ruslan Savchuk. Web Developer · Software Engineer.',
    stripIntro: 'Votre site inclut', strip1: 'Design moderne', strip2: 'SEO de base', strip3: 'Réseaux sociaux', strip4: 'Formulaire de contact',
    workEyebrow: 'SÉLECTION DE PROJETS', workSide: 'Moins de mots. Plus de concret.',
    workHeading: 'Des idées variées. Une même approche.', filterLabel: 'Filtrer les projets', filterAll: 'Tous', filterWeb: 'Sites web', filterApp: 'Applications',
    concept: 'Concept de design', website: 'Site web', application: 'Application web',
    photoProjectBadge: 'Projet réalisé', photoProjectSubtitle: 'Site d’une photographe à Calgary', photoProjectLink: 'Ouvrir le site Kseniia Savchuk Photography dans un nouvel onglet',
    careCleanProjectSubtitle: 'Site d’une entreprise de nettoyage à Calgary',
    careCleanProjectLink: 'Ouvrir le site Care & Clean Home dans un nouvel onglet',
    careCleanProjectAlt: 'Page d’accueil de Care & Clean Home — entreprise de nettoyage à Calgary',
    mechanicalProjectSubtitle: 'Site d’une entreprise de chauffage et climatisation à Calgary',
    mechanicalProjectLink: 'Ouvrir le site 17 Mechanical dans un nouvel onglet',
    mechanicalProjectAlt: 'Page d’accueil de 17 Mechanical — entreprise de chauffage, ventilation et climatisation à Calgary',
    roofingProjectSubtitle: 'Site d’une entreprise de toiture à Calgary',
    roofingProjectLink: 'Ouvrir le site Peakline Roofing dans un nouvel onglet',
    roofingProjectAlt: 'Page d’accueil de Peakline Roofing — entreprise de toiture à Calgary',
    roofingArt: 'Conçu pour l’Alberta.<br />Conçu pour durer.',
    formaSubtitle: 'Un espace dédié à l’architecture', orbitSubtitle: 'Vos finances en toute clarté', bloomSubtitle: 'Une boutique en ligne pleine de vie',
    formaAlt: 'Concept de site du studio d’architecture FORMA', orbitAlt: 'Concept du tableau de bord financier Orbit', bloomAlt: 'Concept de la boutique de plantes d’intérieur Bloom',
    bloomArt: 'Un peu de nature.<br />Beaucoup de vie.',
    conceptNote: 'Des projets réalisés et des concepts originaux qui illustrent mon approche du design. Une place pour vos prochaines réussites.',
    servicesEyebrow: 'COMMENT JE PEUX VOUS AIDER', servicesHeading: 'Votre objectif.<br />La bonne solution.',
    servicesDescription: 'Bien plus que des pages sur internet. Des outils qui vous présentent, inspirent confiance et aident votre entreprise à grandir.',
    service1Title: 'Sites web et pages de destination', service1Text: 'Une première rencontre mémorable avec votre marque. Une structure claire, un design soigné et une expérience agréable sur tous les écrans.', service1Tag1: 'Pages de destination', service1Tag2: 'Sites d’entreprise',
    service2Title: 'Applications web', service2Text: 'Quand il vous faut aller plus loin. Des espaces clients, des services interactifs et des interfaces qui simplifient les tâches complexes.', service2Tag1: 'Plateformes web', service2Tag2: 'Intégrations',
    service3Title: 'Boutiques en ligne', service3Text: 'De la découverte d’un produit à la commande. Un parcours d’achat intuitif et une attention portée à chaque détail.', service3Tag2: 'Catalogues de produits',
    service3Tag1: 'E-commerce',
    aboutNote: 'Un peu de curiosité.<br />Beaucoup d’attention.', aboutEyebrow: 'QUELQUES MOTS SUR MOI', aboutHeading: 'La personne derrière le code.<br />Un partenaire pour votre idée.',
    aboutText1: 'Bonjour ! Je suis développeur web et j’accorde autant d’importance à l’apparence d’un site qu’à son fonctionnement. J’aime transformer les défis complexes en solutions simples et intuitives.',
    aboutText2: 'Je prends le temps de comprendre votre idée, de poser des questions et de travailler directement avec vous. Pour que chaque décision ait du sens et que le résultat vous ressemble.',
    mainStack: 'Technologies principales',
    namedIntroduction: 'Bonjour ! Je m’appelle {name}, je suis développeur web et j’accorde autant d’importance à l’apparence d’un site qu’à son fonctionnement. J’aime transformer les défis complexes en solutions simples et intuitives.',
    value1: 'Une communication directe', value2: 'Votre entreprise au cœur du projet', value3: 'Un processus transparent', value4: 'Le souci du résultat', getAcquainted: 'Faisons connaissance',
    processEyebrow: 'COMMENT NOUS TRAVAILLONS', processSide: 'Vous savez toujours où en est le projet.', processHeading: 'Du premier échange au « c’est tout moi ».',
    step1Title: 'Faire connaissance', step1Text: 'Nous parlons de votre idée, de votre public et de vos objectifs. Puis nous définissons le périmètre, les délais et le budget.',
    step2Title: 'Concevoir le projet', step2Text: 'Nous préparons la structure et définissons le style visuel. Le design est validé avant le début du développement.',
    step3Title: 'Donner vie à l’idée', step3Text: 'Le design devient un site fonctionnel. Je vous présente les avancées et prends en compte vos retours.',
    step4Title: 'Mettre en ligne', step4Text: 'Nous vérifions les détails, lançons le site et voyons ensemble comment le gérer. Votre idée est désormais en ligne.',
    faqEyebrow: 'AVANT DE COMMENCER', faqHeading: 'Vous vous posez<br /> peut-être ces questions.',
    faq1Question: 'Combien coûte la création d’un site web ?', faq1Answer: 'Le coût dépend du périmètre, du design et des fonctionnalités. Après un premier échange sur votre projet, je vous prépare une proposition avec le détail des travaux et le budget.',
    faq2Question: 'Combien de temps prend un projet ?', faq2Answer: 'Nous convenons des délais après avoir discuté de vos besoins. Le nombre de pages, la complexité des fonctionnalités et la disponibilité des contenus influencent le calendrier. Avant de commencer, vous aurez un plan clair avec les étapes principales.',
    faq3Question: 'Puis-je vous contacter avec une simple idée ?', faq3Answer: 'Bien sûr. Vous n’avez pas besoin d’un cahier des charges finalisé. Dites-moi à qui s’adresse votre produit et ce que vous souhaitez accomplir. Nous définirons ensemble la structure, les fonctionnalités et les prochaines étapes.',
    faq4Question: 'Que se passe-t-il après le lancement ?', faq4Answer: 'Je vous remets les fichiers et les accès, puis je vous explique comment gérer votre site. Nous pouvons discuter séparément du suivi, des mises à jour et des nouvelles fonctionnalités.',
    contactEyebrow: 'ET SI VOTRE PROJET ÉTAIT LE PROCHAIN ?', contactHeading: 'Créons quelque<br />chose de beau<span class="contact-period">.</span>',
    contactDescription: 'Une grande idée ou un premier pas — tout commence par un échange. Parlez-moi de ce que vous avez en tête.', contactNote: 'Les beaux projets commencent par un « bonjour ».',
    nameLabel: 'Votre nom', namePlaceholder: 'Comment vous appelez-vous ?', emailLabel: 'Adresse e-mail', interestLabel: 'Quel projet avez-vous en tête ?',
    interestWebsite: 'Site web', interestApp: 'Application web', interestShop: 'Boutique en ligne', interestOther: 'Autre projet',
    messageLabel: 'Quel site vous faut-il ?', messagePlaceholder: 'Par exemple : un site de café avec le menu et les coordonnées.',
    formHeading: 'Parlons de votre site', formIntro: 'Décrivez votre site, et je vous recontacte.', formExtrasLabel: 'Choisir le type de projet',
    phoneLabel: 'Numéro de téléphone (facultatif)', phonePlaceholder: 'Votre numéro au format de votre choix',
    formNote: 'Je vous répondrai personnellement par e-mail.',
    submitSend: 'Envoyer la demande', submitSending: 'Envoi en cours…',
    formSent: 'Merci ! Votre demande a été envoyée. Je vous répondrai prochainement.',
    formError: 'L’envoi a échoué. Réessayez ou contactez-moi par e-mail. Vos informations sont conservées dans le formulaire.',
    formRateLimited: 'Trop de tentatives. Patientez une minute, puis réessayez.',
    requiredField: 'Veuillez remplir ce champ.', invalidEmail: 'Veuillez saisir une adresse e-mail valide.', shortMessage: 'Veuillez décrire votre idée en au moins 10 caractères.',
    footerTagline: 'Un design réfléchi. Un développement soigné. Le souci du détail.', backTop: 'Retour en haut', rights: 'Tous droits réservés.', footerCredit: 'CRÉÉ ET DÉVELOPPÉ PAR',
    footerNavigation: 'Navigation du pied de page', footerNavigationHeading: 'Navigation',
    footerConnect: 'Restons en contact', footerSocialCaption: 'Écrivez-moi pour parler de votre projet.',
    emailLinkLabel: 'Envoyer un e-mail',
    socialProfileLabel: '{name} — ouvrir dans un nouvel onglet',
    closeProject: 'Fermer les détails du projet', projectFocus: 'AXES PRINCIPAUX', projectType: 'FORMAT',
    projectDisclaimer: 'Ce concept de démonstration a été créé pour ce portfolio. Il ne s’agit pas d’un projet client mis en ligne.', wantSimilar: 'Parlons d’un projet similaire',
    projectsShown: '{count} projets affichés sur {total}', viewMoreProjects: 'Voir plus de projets',
    openProjectSite: 'Ouvrir le site {name} dans un nouvel onglet', homeLabel: 'Retour à l’accueil',
    formaDescription: 'Un concept visuel pour un studio d’architecture. Une palette douce, une typographie expressive et de grandes images créent un espace où l’architecture est au premier plan. La structure présente le studio, sa philosophie et une sélection de projets.',
    formaFocus: 'Direction artistique, typographie, structure', formaType: 'Site de studio d’architecture',
    orbitDescription: 'Un concept de tableau de bord financier pour garder une vue d’ensemble. Graphiques, soldes et dernières transactions sont réunis dans une interface cohérente à la hiérarchie claire. Une palette sombre et des accents discrets permettent de se concentrer sur l’essentiel.',
    orbitFocus: 'Interface, visualisation des données, UX', orbitType: 'Tableau de bord financier',
    bloomDescription: 'Un concept de boutique de plantes d’intérieur à l’ambiance chaleureuse et naturelle. De grandes fiches produits, des catégories simples et des couleurs douces facilitent le choix. Le style visuel associe une typographie éditoriale à des illustrations botaniques.',
    bloomFocus: 'Catalogue, fiches produits, identité visuelle', bloomType: 'Boutique de plantes en ligne',
  };

  translations.es = spanish;
  translations.de = german;
  translations.pt = portuguese;

  const isSupportedLanguage = value => Object.prototype.hasOwnProperty.call(translations, value);
  const defaultLanguage = isSupportedLanguage(config.defaultLanguage) ? config.defaultLanguage : 'en';
  const openGraphLocales = { uk: 'uk_UA', en: 'en_US', fr: 'fr_FR', es: 'es_ES', de: 'de_DE', pt: 'pt_PT' };
  const htmlKeys = new Set(['artSticker', 'bloomArt', 'roofingArt', 'servicesHeading', 'aboutNote', 'aboutHeading', 'faqHeading', 'contactHeading']);
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const languageSwitch = document.querySelector('.language-switch');
  const languageToggle = document.querySelector('.language-toggle');
  const languageOptions = document.getElementById('language-options');
  const languageLabels = {
    uk: { code: 'UA', name: 'Українська' },
    en: { code: 'EN', name: 'English' },
    fr: { code: 'FR', name: 'Français' },
    es: { code: 'ES', name: 'Español' },
    de: { code: 'DE', name: 'Deutsch' },
    pt: { code: 'PT', name: 'Português' },
  };
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const dialog = document.getElementById('project-dialog');
  const projectNames = { forma: 'FORMA®', orbit: 'orbit.', bloom: 'Bloom' };
  const projectGrid = document.getElementById('projects-grid');
  const projectPagination = document.getElementById('projects-pagination');
  const moreProjectsButton = document.getElementById('projects-more');
  const initialProjectCount = Number.isInteger(projectSettings.initialCount) && projectSettings.initialCount > 0 ? projectSettings.initialCount : 3;
  const projectPageSize = Number.isInteger(projectSettings.pageSize) && projectSettings.pageSize > 0 ? projectSettings.pageSize : 3;
  const additionalProjects = new Map();
  const additionalProjectCards = new Map();
  let projectFilter = 'all';
  let visibleProjectLimit = initialProjectCount;
  const brand = typeof config.brand === 'string' && config.brand.trim() ? config.brand.trim() : 'Ruslan Savchuk';
  const brandTagline = config.tagline || 'Web Developer · Software Engineer';
  const email = typeof config.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email) ? config.email : '';
  let language = defaultLanguage;
  let activeProject = null;
  let statusKey = '';
  let sending = false;
  let menuScrollFrame = 0;
  let languageScrollFrame = 0;

  function setLanguageMenu(open) {
    cancelAnimationFrame(languageScrollFrame);
    languageScrollFrame = 0;
    languageToggle.setAttribute('aria-expanded', String(open));
    languageOptions.hidden = !open;
    if (open) {
      // Ignore the browser's focus/scroll adjustment while opening the menu.
      languageScrollFrame = requestAnimationFrame(() => {
        languageScrollFrame = requestAnimationFrame(() => { languageScrollFrame = 0; });
      });
    }
  }

  function setMenu(open) {
    cancelAnimationFrame(menuScrollFrame);
    menuScrollFrame = 0;
    if (open) setLanguageMenu(false);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', translations[language][open ? 'closeMenu' : 'openMenu']);
    mobileNav.hidden = !open;
    if (open) {
      // Let scroll anchoring settle after the sticky header expands.
      menuScrollFrame = requestAnimationFrame(() => {
        menuScrollFrame = requestAnimationFrame(() => { menuScrollFrame = 0; });
      });
    }
  }

  function updateProject() {
    if (!activeProject) return;
    const dictionary = translations[language];
    const project = additionalProjects.get(activeProject);
    const copy = project ? projectCopy(project) : null;
    document.getElementById('dialog-title').textContent = project ? project.name : projectNames[activeProject];
    const preview = document.getElementById('dialog-image');
    preview.src = project ? project.image : `/assets/${activeProject}.svg`;
    preview.alt = copy ? copy.alt || project.name : dictionary[`${activeProject}Alt`];
    document.getElementById('dialog-description').textContent = copy ? copy.description || copy.subtitle || '' : dictionary[`${activeProject}Description`];
    document.getElementById('dialog-focus').textContent = copy ? copy.focus || '—' : dictionary[`${activeProject}Focus`];
    document.getElementById('dialog-type').textContent = copy ? copy.format || copy.type || '' : dictionary[`${activeProject}Type`];
  }

  function projectCopy(project) {
    return { ...(project.uk || {}), ...(project[language] || {}) };
  }

  function updateAdditionalProjects() {
    additionalProjectCards.forEach((card, id) => {
      const project = additionalProjects.get(id);
      const copy = projectCopy(project);
      card.querySelector('h3').textContent = project.name;
      card.querySelector('.project-info p').textContent = copy.subtitle || '';
      card.querySelector('.project-type').textContent = copy.type || translations[language][project.category === 'app' ? 'application' : 'website'];
      card.querySelector('img').alt = copy.alt || project.name;
      const link = card.querySelector('a.project-open');
      card.querySelector('.concept-badge').textContent = translations[language][link ? 'photoProjectBadge' : 'concept'];
      if (link) link.setAttribute('aria-label', translations[language].openProjectSite.replace('{name}', project.name));
    });
  }

  function updateVisibleProjects() {
    const cards = [...projectGrid.querySelectorAll('.project-card')];
    const matching = cards.filter(card => projectFilter === 'all' || card.dataset.category === projectFilter);
    const visible = new Set(matching.slice(0, visibleProjectLimit));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    const remaining = matching.length - visible.size;
    moreProjectsButton.hidden = remaining === 0;
    document.getElementById('projects-more-count').textContent = `+${Math.min(projectPageSize, remaining)}`;
    document.getElementById('projects-count').textContent = translations[language].projectsShown
      .replace('{count}', visible.size).replace('{total}', matching.length);
    document.getElementById('projects-progress-fill').style.width = `${matching.length ? visible.size / matching.length * 100 : 0}%`;
    projectPagination.hidden = false;
    return matching;
  }

  function setLanguage(nextLanguage, updateUrl = true, rememberLanguage = updateUrl) {
    language = isSupportedLanguage(nextLanguage) ? nextLanguage : defaultLanguage;
    const dictionary = translations[language];
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      if (dictionary[key] === undefined) return;
      if (htmlKeys.has(key)) element.innerHTML = dictionary[key];
      else element.textContent = dictionary[key];
    });
    ['aria', 'placeholder', 'alt'].forEach(type => {
      document.querySelectorAll(`[data-i18n-${type}]`).forEach(element => {
        const key = element.getAttribute(`data-i18n-${type}`);
        element.setAttribute(type === 'aria' ? 'aria-label' : type, dictionary[key]);
      });
    });
    document.querySelectorAll('[data-lang]').forEach(button => {
      const current = button.dataset.lang === language;
      button.setAttribute('aria-pressed', String(current));
      button.hidden = current;
    });
    document.getElementById('current-language').textContent = languageLabels[language].code;
    languageToggle.lang = language;
    languageToggle.setAttribute('aria-label', `${dictionary.languageLabel}: ${languageLabels[language].name}`);
    const owner = config.name?.[language] || '';
    document.querySelectorAll('[data-owner]').forEach(element => element.textContent = owner || brand);
    if (owner) document.querySelector('[data-i18n="aboutText1"]').textContent = dictionary.namedIntroduction.replace('{name}', owner);
    document.title = `${owner || brand} — ${dictionary.pageTitle}`;
    document.querySelector('meta[name="description"]').content = dictionary.pageDescription;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = dictionary.pageDescription;
    document.querySelector('meta[property="og:locale"]').content = openGraphLocales[language];
    document.querySelector('meta[property="og:image:alt"]').content = dictionary.brandImageAlt;
    document.querySelectorAll('.logo').forEach(element => element.setAttribute('aria-label', `${brand} — ${dictionary.brandTagline || brandTagline} — ${dictionary.homeLabel}`));
    document.querySelectorAll('a[data-social]').forEach(link => {
      link.setAttribute('aria-label', dictionary.socialProfileLabel.replace('{name}', link.title));
    });
    document.getElementById('submit-label').textContent = dictionary[sending ? 'submitSending' : 'submitSend'];
    formStatus.textContent = statusKey ? dictionary[statusKey] : '';
    form.querySelectorAll('input, textarea').forEach(input => input.setCustomValidity(''));
    menuButton.setAttribute('aria-label', dictionary[mobileNav.hidden ? 'openMenu' : 'closeMenu']);
    updateAdditionalProjects();
    updateVisibleProjects();
    updateProject();
    if (rememberLanguage) {
      try {
        localStorage.setItem(LANGUAGE_PREFERENCE_KEY, JSON.stringify({ language, browserLanguage }));
      } catch { /* Storage can be disabled. */ }
    }
    if (updateUrl && ['http:', 'https:'].includes(location.protocol)) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    }
  }

  document.querySelectorAll('[data-brand]').forEach(element => {
    element.textContent = brand.replace(/\.$/, '');
    if (brand.endsWith('.')) {
      const dot = document.createElement('span');
      dot.className = 'logo-dot'; dot.textContent = '.'; element.append(dot);
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  if (email) {
    const contactEmail = document.getElementById('contact-email');
    contactEmail.textContent = email;
    contactEmail.href = `mailto:${email}`;
    contactEmail.hidden = false;
    const footerEmail = document.getElementById('footer-email');
    footerEmail.querySelector('span').textContent = email;
    footerEmail.href = `mailto:${email}`;
    footerEmail.hidden = false;
  }
  const socialNames = { whatsapp: 'WhatsApp', github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram', telegram: 'Telegram' };
  Object.entries(config.social || {}).forEach(([key, value]) => {
    if (!value || !socialNames[key]) return;
    try {
      const url = new URL(value);
      if (!['https:', 'http:'].includes(url.protocol)) return;
      const icon = document.querySelector(`[data-social="${key}"]`);
      if (!icon) return;
      const link = document.createElement('a');
      link.className = icon.className;
      link.dataset.social = key;
      link.title = socialNames[key];
      link.href = url.href;
      link.append(...icon.childNodes);
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      icon.replaceWith(link);
    } catch { /* Ignore incomplete configuration URLs. */ }
  });

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
    setLanguageMenu(false);
    languageToggle.focus({ preventScroll: true });
  }));
  languageToggle.addEventListener('click', () => {
    const open = languageOptions.hidden;
    if (open) setMenu(false);
    setLanguageMenu(open);
  });
  languageToggle.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setMenu(false);
    setLanguageMenu(true);
    const options = [...languageOptions.querySelectorAll('button:not([hidden])')];
    options[event.key === 'ArrowDown' ? 0 : options.length - 1].focus();
  });
  languageSwitch.addEventListener('focusout', event => {
    if (!languageSwitch.contains(event.relatedTarget)) setLanguageMenu(false);
  });
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  addEventListener('scroll', () => {
    if (!mobileNav.hidden && !menuScrollFrame) setMenu(false);
    if (mobileQuery.matches && !languageOptions.hidden && !languageScrollFrame) setLanguageMenu(false);
  }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !languageOptions.hidden) {
      setLanguageMenu(false);
      languageToggle.focus({ preventScroll: true });
    }
    if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.language-switch')) setLanguageMenu(false);
    if (!mobileNav.hidden && !event.target.closest('.header')) setMenu(false);
  });
  const mobileQuery = matchMedia('(max-width: 640px)');
  mobileQuery.addEventListener('change', event => { if (!event.matches) setMenu(false); });
  const formExtras = form.querySelector('.form-extras');
  const updateFormExtras = () => { formExtras.open = !mobileQuery.matches; };
  updateFormExtras();
  mobileQuery.addEventListener('change', updateFormExtras);

  const extraProjects = Array.isArray(projectSettings.additional) ? projectSettings.additional : [];
  extraProjects.forEach(project => {
    if (!project || typeof project.id !== 'string' || !/^[a-z0-9-]+$/.test(project.id) || !project.name || !project.image || additionalProjects.has(project.id)) return;
    if (projectGrid.querySelector(`[data-project="${project.id}"]`)) return;
    let websiteUrl = '';
    if (project.url) {
      try {
        const url = new URL(project.url);
        if (['https:', 'http:'].includes(url.protocol)) websiteUrl = url.href;
      } catch { /* An unfinished URL keeps the project as a concept. */ }
    }
    const card = document.createElement('article');
    card.className = 'project-card project-card-additional';
    card.dataset.category = project.category === 'app' ? 'app' : 'website';
    card.hidden = true;
    const control = document.createElement(websiteUrl ? 'a' : 'button');
    control.className = 'project-open';
    if (websiteUrl) {
      control.href = websiteUrl;
      control.target = '_blank';
      control.rel = 'noopener noreferrer';
    } else {
      control.type = 'button';
      control.dataset.project = project.id;
      control.setAttribute('aria-labelledby', `extra-${project.id}-title`);
    }
    control.innerHTML = '<div class="project-art project-art-additional"><span class="concept-badge"></span><img width="800" height="570" loading="lazy" decoding="async" alt="" /><span class="project-open-icon" aria-hidden="true">↗</span></div><div class="project-info"><div><h3></h3><p></p></div><span class="project-type"></span></div>';
    control.querySelector('img').src = project.image;
    control.querySelector('h3').id = `extra-${project.id}-title`;
    card.append(control);
    projectGrid.append(card);
    additionalProjects.set(project.id, project);
    additionalProjectCards.set(project.id, card);
  });

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      projectFilter = button.dataset.filter;
      visibleProjectLimit = initialProjectCount;
      updateVisibleProjects();
    });
  });

  moreProjectsButton.addEventListener('click', () => {
    const previousLimit = visibleProjectLimit;
    visibleProjectLimit += projectPageSize;
    const matching = updateVisibleProjects();
    const firstNewProject = matching[previousLimit];
    if (firstNewProject) {
      firstNewProject.querySelector('.project-open').focus({ preventScroll: true });
      firstNewProject.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  });

  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      activeProject = button.dataset.project;
      updateProject();
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('modal-open');
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  document.getElementById('dialog-contact').addEventListener('click', () => {
    dialog.close();
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 100);
  });

  form.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('invalid', () => {
      const dictionary = translations[language];
      if (input.validity.valueMissing) input.setCustomValidity(dictionary.requiredField);
      else if (input.validity.typeMismatch) input.setCustomValidity(dictionary.invalidEmail);
      else if (input.validity.tooShort) input.setCustomValidity(dictionary.shortMessage);
    });
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      if (statusKey) { statusKey = ''; formStatus.textContent = ''; }
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const dictionary = translations[language];
    for (const field of ['name', 'message']) {
      const input = form.elements[field];
      const minimum = field === 'message' ? 10 : 1;
      if (input.value.trim().length < minimum) {
        input.setCustomValidity(dictionary[field === 'message' ? 'shortMessage' : 'requiredField']);
        input.reportValidity();
        return;
      }
    }
    const data = new FormData(form);
    const payload = Object.fromEntries(data);
    payload.language = language;
    sending = true;
    statusKey = '';
    formStatus.textContent = '';
    form.dataset.status = 'sending';
    form.setAttribute('aria-busy', 'true');
    form.querySelectorAll('input, textarea, button').forEach(input => { input.disabled = true; });
    document.getElementById('submit-label').textContent = dictionary.submitSending;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        statusKey = response.status === 429 ? 'formRateLimited' : 'formError';
        form.dataset.status = 'error';
      } else {
        form.reset();
        statusKey = 'formSent';
        form.dataset.status = 'success';
      }
    } catch {
      statusKey = 'formError';
      form.dataset.status = 'error';
    } finally {
      sending = false;
      form.removeAttribute('aria-busy');
      form.querySelectorAll('input, textarea, button').forEach(input => { input.disabled = false; });
      document.getElementById('submit-label').textContent = translations[language].submitSend;
      formStatus.textContent = translations[language][statusKey];
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.desktop-nav a').forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }

  const supportedLanguages = Object.keys(translations);
  const browserLanguage = detectBrowserLanguage(navigator.language, navigator.languages, supportedLanguages, defaultLanguage);
  let savedPreference = null;
  try {
    savedPreference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  } catch { /* Use browser preferences when storage is disabled. */ }
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  const initialLanguage = resolveInitialLanguage({ queryLanguage, savedPreference, browserLanguage, supportedLanguages });
  setLanguage(initialLanguage, false, false);
})();
