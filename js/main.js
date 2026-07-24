/* ==========================================================================
   BASMA AHED — main.js
   Preloader, smooth scroll, scroll-driven 3D camera, content rendering,
   micro-interactions.
   ========================================================================== */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* =========================================================
     DATA — projects
     ========================================================= */
  const PROJECTS = [
    {
      name: 'ROSHN Sedra', type: 'Luxury Residential Development', location: 'Riyadh',
      status: 'Completed', year: '2024', scale: '2.4M m²', client: 'ROSHN Group',
      c1: '#4a4d47', c2: '#141614',
      img: 'assets/projects/roshn-sedra.png',
      desc: 'A master-planned residential district weaving parks, retail promenades and family villas into one of Riyadh\u2019s largest new communities.',
      name_ar: 'روشن سدرة', type_ar: 'تطوير سكني فاخر', location_ar: 'الرياض', client_ar: 'مجموعة روشن',
      desc_ar: 'حي سكني مخطط بعناية يجمع بين الحدائق وممرات التسوق والفلل العائلية ضمن أحد أكبر المجتمعات الجديدة في الرياض.',
    },
    {
      name: 'ROSHN Alarous Jeddah', type: 'Premium Residential Community', location: 'Jeddah',
      status: 'Ongoing', year: '2024', scale: '1.1M m²', client: 'ROSHN Group',
      c1: '#3d4a4a', c2: '#101414',
      img: 'assets/projects/roshn-alarous-jeddah.png',
      desc: 'Coastal-influenced low-rise living on the Red Sea corridor, built around walkable streets and shaded courtyards.',
      name_ar: 'روشن العروس جدة', type_ar: 'مجتمع سكني راقٍ', location_ar: 'جدة', client_ar: 'مجموعة روشن',
      desc_ar: 'مساكن منخفضة الارتفاع مستوحاة من الطابع الساحلي على امتداد البحر الأحمر، مبنية حول شوارع قابلة للمشي وأفنية مظللة.',
    },
    {
      name: 'Qiddiya', type: 'Entertainment & Sports Destination', location: 'Riyadh',
      status: 'Ongoing', year: '2024', scale: '334 km²', client: 'Qiddiya Investment Co.',
      c1: '#4a3d2f', c2: '#161210',
      img: 'assets/projects/qiddiya.png',
      desc: 'A canyon-edge entertainment city combining stadiums, theme parks and motorsport venues at national scale.',
      name_ar: 'القدية', type_ar: 'وجهة ترفيهية ورياضية', location_ar: 'الرياض', client_ar: 'شركة القدية للاستثمار',
      desc_ar: 'مدينة ترفيهية عند حافة الوادي تجمع بين الملاعب والمدن الترفيهية ومضامير رياضة السيارات على نطاق وطني.',
    },
    {
      name: 'The Avenues Riyadh', type: 'Mixed-use Retail & Entertainment Complex', location: 'Riyadh',
      status: 'Completed', year: '2024', scale: '450K m²', client: 'Mabanee',
      c1: '#3a4046', c2: '#101214',
      img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Riyadh-Skyline.jpg?width=900',
      desc: 'A retail and lifestyle destination anchoring a new commercial spine in northern Riyadh, delivered on schedule.',
      name_ar: 'ذا أفنيوز الرياض', type_ar: 'مجمع تجاري وترفيهي متعدد الاستخدامات', location_ar: 'الرياض', client_ar: 'المباني',
      desc_ar: 'وجهة تسوق وترفيه ترسّخ محورًا تجاريًا جديدًا في شمال الرياض، تم تسليمها في الموعد المحدد.',
    },
    {
      name: 'New Murabba', type: 'Downtown Mixed-use Development', location: 'Riyadh',
      status: 'Ongoing', year: '2024', scale: '19M m²', client: 'New Murabba Development Co.',
      c1: '#46403a', c2: '#141210',
      img: 'assets/projects/new-murabba.png',
      desc: 'A next-generation downtown built around Mukaab, redefining the Riyadh skyline with immersive architecture.',
      name_ar: 'المربع الجديد', type_ar: 'تطوير وسط مدينة متعدد الاستخدامات', location_ar: 'الرياض', client_ar: 'شركة المربع الجديد للتطوير',
      desc_ar: 'وسط مدينة من الجيل القادم يتمحور حول مكعّب، يعيد تشكيل أفق الرياض بعمارة غامرة.',
    },
    {
      name: 'Diriyah Project', type: 'UNESCO World Heritage Restoration', location: 'Riyadh',
      status: 'Ongoing', year: '2024', scale: '14 km²', client: 'Diriyah Company',
      c1: '#4a3a2c', c2: '#16110c',
      img: 'assets/projects/diriyah.png',
      desc: 'Careful restoration and expansion of the birthplace of the Saudi state, balancing heritage fabric with new cultural venues.',
      name_ar: 'مشروع الدرعية', type_ar: 'ترميم موقع تراث عالمي لليونسكو', location_ar: 'الرياض', client_ar: 'شركة الدرعية',
      desc_ar: 'ترميم وتوسعة دقيقان لمهد الدولة السعودية، بما يوازن بين النسيج التراثي والمرافق الثقافية الجديدة.',
    },
    {
      name: 'Boulevard Sela', type: 'Commercial & Residential Development', location: 'Riyadh',
      status: 'Ongoing', year: '2024', scale: '620K m²', client: 'SELA',
      c1: '#403d4a', c2: '#121014',
      img: 'assets/projects/boulevard-sela.png',
      desc: 'A vertical mixed-use boulevard blending residences, offices and entertainment along a landscaped spine.',
      name_ar: 'بوليفارد سيلا', type_ar: 'تطوير تجاري وسكني', location_ar: 'الرياض', client_ar: 'سيلا',
      desc_ar: 'بوليفارد عمودي متعدد الاستخدامات يمزج بين المساكن والمكاتب والترفيه على امتداد محور مشجّر.',
    },
    {
      name: 'King Faisal University', type: 'Educational Infrastructure Development', location: 'Al Khobar',
      status: 'Completed', year: '2024', scale: '210K m²', client: 'Ministry of Education',
      c1: '#3a4640', c2: '#0f1412',
      img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kfu.PNG?width=900',
      desc: 'Modern academic campus infrastructure supporting research faculties and student housing, completed on budget.',
      name_ar: 'جامعة الملك فيصل', type_ar: 'تطوير بنية تحتية تعليمية', location_ar: 'الخبر', client_ar: 'وزارة التعليم',
      desc_ar: 'بنية تحتية جامعية حديثة تدعم الكليات البحثية والسكن الطلابي، أُنجزت ضمن الميزانية المحددة.',
    },
  ];
  const STATUS_AR = { Completed: 'مكتمل', Ongoing: 'قيد التنفيذ' };

  /* =========================================================
     I18N — English / Arabic translations
     ========================================================= */
  const T = {
    en: {
      'nav.about': 'About', 'nav.projects': 'Projects', 'nav.services': 'Services', 'nav.contact': 'Contact',
      'auth.login': 'Login', 'auth.title': 'Sign in to your account', 'auth.desc': 'Access your requests and manage incoming messages.', 'auth.signupTitle': 'Create your account', 'auth.signupDesc': 'Create an account to track your requests.', 'auth.signup': 'Create account', 'auth.createAccount': 'Create account', 'auth.haveAccount': 'Already have an account? Login', 'auth.portal': 'Portal', 'auth.email': 'Email', 'auth.password': 'Password', 'auth.logout': 'Logout', 'auth.invalid': 'Invalid email or password.', 'auth.demo': '',
      'requests.title': 'Requests', 'requests.total': 'Total Requests', 'requests.new': 'New Requests', 'requests.empty': 'No requests yet. Messages submitted through the contact form will appear here.', 'requests.newBadge': 'New request',
      'nav.cta': 'Get a Quote',
      'hero.district': '00 — ARRIVAL',
      'hero.eyebrow': 'GENERAL CONTRACTING · SAUDI ARABIA',
      'hero.title1': 'Building', 'hero.title2': 'Excellence',
      'hero.desc': 'BASMA AHED delivers comprehensive construction solutions, infrastructure development, manpower supply and materials trading across the Kingdom.',
      'hero.exploreBtn': 'Explore Projects',
      'hero.vision': 'Aligned with Vision 2030 — contributing to Saudi Arabia\u2019s economic growth and sustainable development.',
      'hero.scroll': 'SCROLL TO ENTER SITE',
      'stats.projects': 'Projects Completed', 'stats.contracts': 'Major Contracts',
      'stats.satisfaction': 'Satisfaction Rate', 'stats.support': 'Support Team',
      'about.district': '01 — FOUNDATION',
      'about.statement': '<span class="hl">BASMA AHED</span> is a leading general contracting company in Saudi Arabia, specializing in comprehensive construction solutions, infrastructure development, manpower supply and materials trading — delivering transformative projects that contribute to the Kingdom\u2019s growth and Vision 2030.',
      'about.projects': 'Projects', 'about.contracts': 'Contracts', 'about.coverage': 'Coverage', 'about.nationwide': 'Nationwide',
      'leadership.district': '02 — LEADERSHIP',
      'leadership.quote': '\u201cAt BASMA AHED, we are committed to delivering exceptional value to our clients through innovative solutions and unwavering dedication to quality. We believe in building not just structures, but lasting partnerships that drive mutual success and contribute to Saudi Arabia\u2019s ambitious development goals.\u201d',
      'leadership.ceoName': 'Faisal Ali Abdullah Al Qarni', 'leadership.ceoTitle': 'Chief Executive Officer',
      'leadership.mission': 'Mission', 'leadership.missionText': 'To deliver world-class construction and contracting services that transform communities and drive economic growth.',
      'leadership.vision': 'Vision', 'leadership.visionText': 'To be the most trusted and innovative contracting partner in the Middle East, known for excellence, integrity and sustainable development.',
      'leadership.values': 'Values', 'leadership.valuesText': 'Quality · Innovation · Integrity · Safety · Sustainability',
      'projects.district': '03 — PROJECTS', 'projects.heading': 'Selected Developments',
      'projects.sub': 'A survey of megaprojects currently shaping the Kingdom\u2019s skyline.',
      'services.district': '04 — CAPABILITIES', 'services.heading': 'Our Services',
      'services.sub': 'BASMA AHED combines expertise across every service area to deliver integrated, seamless project execution.',
      'impact.district': '05 — IMPACT',
      'contact.district': '06 — CONTACT',
      'contact.heading': 'Get a free<br>quote today.',
      'contact.desc': 'Tell us about your project, and our team will get back to you with a tailored proposal.',
      'contact.coverage': 'Nationwide Coverage, Saudi Arabia',
      'form.name': 'Name', 'form.email': 'Email', 'form.subject': 'Project Type', 'form.message': 'Message', 'form.send': 'Send Message',
      'form.residential': 'Residential', 'form.commercial': 'Commercial', 'form.infrastructure': 'Infrastructure', 'form.other': 'Other',
      'form.sending': 'Sending…', 'form.sent': 'Thank you — our planning team will be in touch within one business day.',
      'panel.location': 'Location', 'panel.client': 'Client', 'panel.scale': 'Scale', 'panel.year': 'Target Year',
      'footer.mapTag': 'SERVING SAUDI ARABIA · NATIONWIDE COVERAGE',
      'footer.about': 'Leading general contracting company in Saudi Arabia specializing in construction, infrastructure and manpower supply.',
      'footer.quickLinks': 'Quick Links', 'footer.home': 'Home', 'footer.legal': 'Legal',
      'footer.servingKsa': 'Serving Saudi Arabia Nationwide',
      'footer.rights': 'All rights reserved.', 'footer.privacy': 'Privacy', 'footer.terms': 'Terms', 'footer.backToTop': 'Back to top',
      'meta.title': 'BASMA AHED — General Contracting Company',
      'meta.desc': 'BASMA AHED — Leading general contracting company in Saudi Arabia. Construction, infrastructure, manpower supply and materials trading, aligned with Vision 2030.',
    },
    ar: {
      'nav.about': 'من نحن', 'nav.projects': 'المشاريع', 'nav.services': 'خدماتنا', 'nav.contact': 'اتصل بنا',
      'auth.login': 'تسجيل الدخول', 'auth.title': 'تسجيل الدخول إلى حسابك', 'auth.desc': 'الوصول إلى الطلبات وإدارة الرسائل الواردة.', 'auth.signupTitle': 'إنشاء حساب', 'auth.signupDesc': 'أنشئ حسابًا لمتابعة طلباتك.', 'auth.signup': 'إنشاء حساب', 'auth.createAccount': 'إنشاء حساب', 'auth.haveAccount': 'لديك حساب بالفعل؟ تسجيل الدخول', 'auth.portal': 'البوابة', 'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور', 'auth.logout': 'تسجيل الخروج', 'auth.invalid': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'auth.demo': '',
      'requests.title': 'الطلبات', 'requests.total': 'إجمالي الطلبات', 'requests.new': 'الطلبات الجديدة', 'requests.empty': 'لا توجد طلبات حتى الآن. ستظهر الرسائل المرسلة من نموذج التواصل هنا.', 'requests.newBadge': 'طلب جديد',
      'nav.cta': 'اطلب عرض سعر',
      'hero.district': '٠٠ — البداية',
      'hero.eyebrow': 'مقاولات عامة · المملكة العربية السعودية',
      'hero.title1': 'نبني', 'hero.title2': 'التميز',
      'hero.desc': 'تقدم بصمة عهد حلولاً إنشائية متكاملة، وتطوير بنية تحتية، وتوفير قوى عاملة، وتجارة مواد بناء في مختلف أنحاء المملكة.',
      'hero.exploreBtn': 'استكشف المشاريع',
      'hero.vision': 'بما يتماشى مع رؤية 2030 — إسهامًا في النمو الاقتصادي والتنمية المستدامة للمملكة العربية السعودية.',
      'hero.scroll': 'مرّر للأسفل للدخول',
      'stats.projects': 'مشروع منجز', 'stats.contracts': 'عقد رئيسي',
      'stats.satisfaction': 'نسبة الرضا', 'stats.support': 'فريق الدعم',
      'about.district': '٠١ — الأساس',
      'about.statement': '<span class="hl">بصمة عهد</span> شركة مقاولات عامة رائدة في المملكة العربية السعودية، متخصصة في حلول الإنشاء المتكاملة، وتطوير البنية التحتية، وتوفير القوى العاملة، وتجارة مواد البناء — وتُنجز مشاريع نوعية تسهم في نمو المملكة وتحقيق رؤية 2030.',
      'about.projects': 'المشاريع', 'about.contracts': 'العقود', 'about.coverage': 'التغطية', 'about.nationwide': 'على مستوى المملكة',
      'leadership.district': '٠٢ — القيادة',
      'leadership.quote': '\u201cفي بصمة عهد، نلتزم بتقديم قيمة استثنائية لعملائنا من خلال حلول مبتكرة وتفانٍ راسخ في الجودة. نؤمن بأننا لا نبني منشآت فحسب، بل شراكات دائمة تحقق نجاحًا مشتركًا وتسهم في تحقيق أهداف المملكة التنموية الطموحة.\u201d',
      'leadership.ceoName': 'فيصل علي عبدالله القرني', 'leadership.ceoTitle': 'الرئيس التنفيذي',
      'leadership.mission': 'الرسالة', 'leadership.missionText': 'تقديم خدمات إنشاء ومقاولات على مستوى عالمي تُحدث نقلة في المجتمعات وتدفع عجلة النمو الاقتصادي.',
      'leadership.vision': 'الرؤية', 'leadership.visionText': 'أن نكون الشريك الأكثر ثقة وابتكارًا في قطاع المقاولات بالشرق الأوسط، معروفين بالتميز والنزاهة والتنمية المستدامة.',
      'leadership.values': 'القيم', 'leadership.valuesText': 'الجودة · الابتكار · النزاهة · السلامة · الاستدامة',
      'projects.district': '٠٣ — المشاريع', 'projects.heading': 'مشاريع مختارة',
      'projects.sub': 'نظرة على المشاريع الكبرى التي تُشكّل ملامح أفق المملكة حاليًا.',
      'services.district': '٠٤ — القدرات', 'services.heading': 'خدماتنا',
      'services.sub': 'تجمع بصمة عهد خبراتها في جميع مجالات الخدمة لتقديم تنفيذ متكامل وسلس للمشاريع.',
      'impact.district': '٠٥ — الأثر',
      'contact.district': '٠٦ — التواصل',
      'contact.heading': 'احصل على عرض سعر<br>مجاني اليوم.',
      'contact.desc': 'أخبرنا عن مشروعك، وسيتواصل معك فريقنا بعرض مخصص يلبي احتياجاتك.',
      'contact.coverage': 'تغطية شاملة لكافة أنحاء المملكة العربية السعودية',
      'form.name': 'الاسم', 'form.email': 'البريد الإلكتروني', 'form.subject': 'نوع المشروع', 'form.message': 'الرسالة', 'form.send': 'إرسال الرسالة',
      'form.residential': 'سكني', 'form.commercial': 'تجاري', 'form.infrastructure': 'بنية تحتية', 'form.other': 'أخرى',
      'form.sending': 'جارٍ الإرسال…', 'form.sent': 'شكرًا لك — سيتواصل معك فريق التخطيط لدينا خلال يوم عمل واحد.',
      'panel.location': 'الموقع', 'panel.client': 'العميل', 'panel.scale': 'المساحة', 'panel.year': 'السنة المستهدفة',
      'footer.mapTag': 'نخدم السعودية · تغطية شاملة',
      'footer.about': 'شركة مقاولات عامة رائدة في المملكة العربية السعودية، متخصصة في الإنشاءات والبنية التحتية وتوفير القوى العاملة.',
      'footer.quickLinks': 'روابط سريعة', 'footer.home': 'الرئيسية', 'footer.legal': 'قانوني',
      'footer.servingKsa': 'نخدم جميع مناطق المملكة',
      'footer.rights': 'جميع الحقوق محفوظة.', 'footer.privacy': 'الخصوصية', 'footer.terms': 'الشروط', 'footer.backToTop': 'العودة للأعلى',
      'meta.title': 'بصمة عهد — شركة مقاولات عامة',
      'meta.desc': 'بصمة عهد — شركة مقاولات عامة رائدة في المملكة العربية السعودية. إنشاءات وبنية تحتية وتوفير قوى عاملة وتجارة مواد بناء، بما يتماشى مع رؤية 2030.',
    },
  };

  let currentLang = localStorage.getItem('basma-lang') || 'en';

  function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (T[lang][key] !== undefined) el.textContent = T[lang][key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (T[lang][key] !== undefined) el.innerHTML = T[lang][key];
    });

    document.title = T[lang]['meta.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', T[lang]['meta.desc']);

    document.querySelectorAll('.lang-toggle').forEach((btn) => {
      btn.querySelector('.lang-en').classList.toggle('active', lang === 'en');
      btn.querySelector('.lang-ar').classList.toggle('active', lang === 'ar');
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('basma-lang', lang);
    applyTranslations(lang);
    if (typeof renderProjects === 'function') renderProjects(lang);
    if (typeof renderServices === 'function') renderServices(lang);
  }

  applyTranslations(currentLang);
  document.querySelectorAll('#langToggle, #langToggleMobile').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'ar' : 'en'));
  });

  /* =========================================================
     DATA — services
     ========================================================= */
  const SERVICES = [
    { icon: 'fa-helmet-safety', title: 'General Contracting', text: 'Comprehensive construction and contracting solutions for residential, commercial and industrial projects.',
      title_ar: 'المقاولات العامة', text_ar: 'حلول إنشاء ومقاولات شاملة للمشاريع السكنية والتجارية والصناعية.' },
    { icon: 'fa-people-group', title: 'Manpower Supply', text: 'Skilled and unskilled workforce recruitment and management for various industries.',
      title_ar: 'توفير القوى العاملة', text_ar: 'استقطاب وإدارة الكوادر الماهرة وغير الماهرة لمختلف القطاعات.' },
    { icon: 'fa-road', title: 'Infrastructure', text: 'Development and maintenance of critical infrastructure including roads, utilities and public facilities.',
      title_ar: 'البنية التحتية', text_ar: 'تطوير وصيانة البنية التحتية الحيوية بما يشمل الطرق والمرافق والمنشآت العامة.' },
    { icon: 'fa-tree', title: 'Landscape & Irrigation', text: 'Professional landscaping design and irrigation system installation for enhanced aesthetics and sustainability.',
      title_ar: 'تنسيق المواقع والري', text_ar: 'تصميم احترافي لتنسيق المواقع وتركيب أنظمة الري لتعزيز الجمالية والاستدامة.' },
    { icon: 'fa-boxes-stacked', title: 'Materials Trading', text: 'Supply and distribution of high-quality construction materials and equipment.',
      title_ar: 'تجارة مواد البناء', text_ar: 'توريد وتوزيع مواد ومعدات البناء عالية الجودة.' },
    { icon: 'fa-truck-ramp-box', title: 'Heavy Equipment & Logistics', text: 'Provision of heavy machinery, equipment rental and comprehensive logistics solutions.',
      title_ar: 'المعدات الثقيلة واللوجستيات', text_ar: 'توفير الآليات الثقيلة وتأجير المعدات وحلول لوجستية متكاملة.' },
    { icon: 'fa-signs-post', title: 'Signage Solutions', text: 'Design, fabrication and installation meeting the highest international standards, ensuring clarity and safety for millions.',
      title_ar: 'حلول اللافتات', text_ar: 'تصميم وتصنيع وتركيب وفق أعلى المعايير العالمية، لضمان الوضوح والسلامة للملايين.' },
  ];

  /* =========================================================
     PRELOADER
     ========================================================= */
  let assetsReady = false;
  let minTimeElapsed = false;
  const preloader = document.getElementById('preloader');
  const fillEl = document.getElementById('preloaderFill');
  const pctEl = document.getElementById('preloaderPct');

  let fakePct = 0;
  const fakeInterval = setInterval(() => {
    fakePct = Math.min(fakePct + Math.random() * 12, 92);
    updatePreloader(fakePct);
  }, 180);

  function updatePreloader(pct) {
    fillEl.style.width = pct + '%';
    pctEl.textContent = String(Math.floor(pct)).padStart(2, '0');
  }

  setTimeout(() => { minTimeElapsed = true; tryHidePreloader(); }, 1600);

  function tryHidePreloader() {
    if (!(assetsReady && minTimeElapsed)) return;
    clearInterval(fakeInterval);
    updatePreloader(100);
    setTimeout(() => {
      preloader.classList.add('hide');
      document.body.classList.add('loaded');
      runHeroIntro();
    }, 300);
  }

  /* =========================================================
     THREE SCENE INIT
     ========================================================= */
  try {
    OmranScene.init();
    assetsReady = true;
  } catch (e) {
    console.error('Scene init failed', e);
    assetsReady = true; // fail open — don't trap the user on the preloader
  }
  tryHidePreloader();

  /* =========================================================
     LENIS SMOOTH SCROLL + GSAP SYNC
     ========================================================= */
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* =========================================================
     SCROLL-DRIVEN CAMERA PROGRESS
     ========================================================= */
  ScrollTrigger.create({
    trigger: '#scrollContainer',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      OmranScene.setProgress(self.progress);
      document.getElementById('hudScrollPct').textContent = String(Math.round(self.progress * 100)).padStart(3, '0');
    },
  });

  /* Mouse parallax feed into scene */
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    OmranScene.setMouse(x, y);
    document.querySelector('.hud-crosshair').style.opacity = '1';
    document.querySelector('.hud-crosshair').style.left = e.clientX + 'px';
    document.querySelector('.hud-crosshair').style.top = e.clientY + 'px';
  });
  window.addEventListener('pointerleave', () => {
    document.querySelector('.hud-crosshair').style.opacity = '0';
  });

  /* =========================================================
     NAV — scroll state + mobile burger + active link
     ========================================================= */
  const nav = document.getElementById('mainNav');
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 60 || window.scrollY > 60),
  });
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    burger.classList.toggle('open');
  });
  document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => {
    navMobile.classList.remove('open');
  }));

  /* =========================================================
     HERO INTRO ANIMATION
     ========================================================= */
  function runHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.eyebrow', { y: 20, opacity: 0, duration: 0.7 })
      .from('.hero-title .line', { yPercent: 120, duration: 1, stagger: 0.12 }, '-=0.4')
      .from('.hero-subtitle-ar', { y: 16, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-desc', { y: 16, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.hero-actions', { y: 16, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.hero-stat', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, onStart: animateHeroStats }, '-=0.45')
      .from('.hero-vision', { y: 12, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.scroll-cue', { opacity: 0, duration: 0.8 }, '-=0.4')
      .from('.glass-nav', { yPercent: -100, duration: 0.8 }, '-=1.2');
  }

  /* =========================================================
     SCROLL REVEALS for generic sections
     ========================================================= */
  function revealOnScroll(selector, opts = {}) {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        ...opts,
      });
    });
  }

  /* =========================================================
     RENDER — Projects grid (language-aware)
     ========================================================= */
  const projectsGrid = document.getElementById('projectsGrid');
  function renderProjects(lang) {
    projectsGrid.innerHTML = '';
    PROJECTS.forEach((p, i) => {
      const isAr = lang === 'ar';
      const name = isAr ? p.name_ar : p.name;
      const type = isAr ? p.type_ar : p.type;
      const location = isAr ? p.location_ar : p.location;
      const status = isAr ? STATUS_AR[p.status] : p.status;
      const statusClass = p.status === 'Completed' ? 'completed' : 'underconstruction';
      const card = document.createElement('article');
      card.className = 'project-card';
      card.style.setProperty('--pc1', p.c1);
      card.style.setProperty('--pc2', p.c2);
      card.innerHTML = `
        <img class="pc-image" src="${p.img}" alt="${name}" loading="lazy">
        <span class="pc-status ${statusClass}">${status}</span>
        <span class="pc-index">0${i + 1}</span>
        <span class="pc-name-tag">${name}</span>
        <h3>${name}</h3>
        <p class="pc-type">${type}</p>
        <span class="pc-loc"><i class="fa-solid fa-location-dot"></i> ${location}</span>
      `;
      card.addEventListener('click', () => openProjectPanel(p));
      projectsGrid.appendChild(card);
    });
    revealOnScroll('.project-card');
  }
  renderProjects(currentLang);

  /* =========================================================
     PROJECT DETAIL PANEL
     ========================================================= */
  const panel = document.getElementById('projectPanel');
  const panelContent = document.getElementById('panelContent');
  const panelClose = document.getElementById('panelClose');

  function openProjectPanel(p) {
    const isAr = currentLang === 'ar';
    const name = isAr ? p.name_ar : p.name;
    const type = isAr ? p.type_ar : p.type;
    const location = isAr ? p.location_ar : p.location;
    const client = isAr ? p.client_ar : p.client;
    const desc = isAr ? p.desc_ar : p.desc;
    const status = isAr ? STATUS_AR[p.status] : p.status;
    const statusClass = p.status === 'Completed' ? 'completed' : 'underconstruction';
    const t = T[currentLang];
    panelContent.innerHTML = `
      <span class="pk-status ${statusClass}">${status}</span>
      <h3>${name}</h3>
      <p class="pk-type">${type}</p>
      <div class="pk-visual" style="--pc1:${p.c1}; --pc2:${p.c2}; background-image:url('${p.img}')">
        <span class="pk-visual-name">${name}</span>
      </div>
      <p>${desc}</p>
      <div class="panel-meta">
        <div><span class="pm-label">${t['panel.location']}</span><span class="pm-value">${location}</span></div>
        <div><span class="pm-label">${t['panel.client']}</span><span class="pm-value">${client}</span></div>
        <div><span class="pm-label">${t['panel.scale']}</span><span class="pm-value">${p.scale}</span></div>
        <div><span class="pm-label">${t['panel.year']}</span><span class="pm-value">${p.year}</span></div>
      </div>
    `;
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    lenis.stop();
  }
  function closeProjectPanel() {
    panel.classList.remove('open');
    document.body.style.overflow = '';
    lenis.start();
  }
  panelClose.addEventListener('click', closeProjectPanel);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectPanel(); });

  /* =========================================================
     RENDER — Services grid (language-aware)
     ========================================================= */
  const servicesGrid = document.getElementById('servicesGrid');
  function renderServices(lang) {
    servicesGrid.innerHTML = '';
    SERVICES.forEach((s) => {
      const isAr = lang === 'ar';
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="service-icon-wrap"><i class="fa-solid ${s.icon}"></i></div>
        <div>
          <h4>${isAr ? s.title_ar : s.title}</h4>
          <p>${isAr ? s.text_ar : s.text}</p>
        </div>
      `;
      servicesGrid.appendChild(card);
    });
    revealOnScroll('.service-card', { stagger: 0.06 });
  }
  renderServices(currentLang);

  /* =========================================================
     STAT COUNTERS
     ========================================================= */
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(counter.val).toLocaleString(); },
        });
      },
    });
  });

  /* Hero mini-stats count up once the intro timeline reveals them */
  function animateHeroStats() {
    document.querySelectorAll('.hero-stat-num').forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/[\d,]+/);
      if (!match) return; // e.g. "24/7" handled as static text
      const target = Number(match[0].replace(/,/g, ''));
      const suffix = raw.replace(match[0], '');
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target, duration: 1.6, ease: 'power2.out', delay: 0.3,
        onUpdate: () => { el.textContent = Math.floor(counter.val).toLocaleString() + suffix; },
      });
    });
  }

  revealOnScroll('.statement-text');
  revealOnScroll('.meta-item', { stagger: 0.08 });
  revealOnScroll('.section-heading');
  revealOnScroll('.ceo-card');
  revealOnScroll('.mvv-card');
  revealOnScroll('.contact-left > *', { stagger: 0.08 });
  revealOnScroll('.contact-form');

  /* =========================================================
     SHARED SUPABASE CONTACT + AUTH
     This standalone site shares the same Supabase Auth/database as the main app.
     ========================================================= */
  const supabaseClient = (window.supabase && window.BASMA_SUPABASE_URL && window.BASMA_SUPABASE_ANON_KEY && !String(window.BASMA_SUPABASE_URL).includes('YOUR-PROJECT'))
    ? window.supabase.createClient(window.BASMA_SUPABASE_URL, window.BASMA_SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
    : null;

  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const authModal = document.getElementById('authModal');
  const requestsPanel = document.getElementById('requestsPanel');
  const loginOpen = document.getElementById('loginOpen');
  const authClose = document.getElementById('authClose');
  const authBackdrop = document.getElementById('authBackdrop');
  const requestsClose = document.getElementById('requestsClose');
  const requestsBackdrop = document.getElementById('requestsBackdrop');
  const loginForm = document.getElementById('loginForm');
  const loginNote = document.getElementById('loginNote');
  const requestsList = document.getElementById('requestsList');
  const requestCount = document.getElementById('requestCount');
  const newRequestCount = document.getElementById('newRequestCount');
  const logoutBtn = document.getElementById('logoutBtn');
  const authModeToggle = document.getElementById('authModeToggle');
  const authSubmit = document.getElementById('authSubmit');
  const authTitle = document.getElementById('authTitle');
  const authDesc = document.getElementById('authDesc');
  let authMode = 'login';

  const t = (key, fallback) => (T[currentLang] && T[currentLang][key]) || fallback;
  const setAuthMode = (mode) => {
    authMode = mode;
    const signup = mode === 'signup';
    authTitle.textContent = signup ? t('auth.signupTitle', 'Create your account') : t('auth.title', 'Sign in to your account');
    authDesc.textContent = signup ? t('auth.signupDesc', 'Create an account to track your requests.') : t('auth.desc', 'Access your requests and manage incoming messages.');
    authSubmit.querySelector('span').textContent = signup ? t('auth.signup', 'Create account') : t('auth.login', 'Login');
    authModeToggle.textContent = signup ? t('auth.haveAccount', 'Already have an account? Login') : t('auth.createAccount', 'Create account');
    loginNote.textContent = '';
  };

  const openAuth = () => { setAuthMode('login'); authModal.classList.add('is-open'); authModal.setAttribute('aria-hidden','false'); setTimeout(() => document.getElementById('loginEmail')?.focus(), 50); };
  const closeAuth = () => { authModal.classList.remove('is-open'); authModal.setAttribute('aria-hidden','true'); loginNote.textContent=''; };
  const openRequests = async () => { await updateRequestDashboard(); requestsPanel.classList.add('is-open'); requestsPanel.setAttribute('aria-hidden','false'); };
  const closeRequests = () => { requestsPanel.classList.remove('is-open'); requestsPanel.setAttribute('aria-hidden','true'); };

  async function getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user || null;
  }

  async function getCurrentProfile(user) {
    if (!user || !supabaseClient) return null;
    const { data } = await supabaseClient.from('profiles').select('full_name, role, is_active').eq('id', user.id).maybeSingle();
    return data || null;
  }

  async function updateRequestDashboard() {
    if (!supabaseClient) {
      requestCount.textContent = '—'; newRequestCount.textContent = '—';
      requestsList.innerHTML = `<div class="requests-empty"><i class="fa-solid fa-plug-circle-xmark"></i><div>Configure js/supabase-config.js with the same Supabase URL and anon key used by the main app.</div></div>`;
      return;
    }
    const user = await getCurrentUser();
    if (!user) return;
    const profile = await getCurrentProfile(user);
    const isStaff = profile && ['manager','supervisor'].includes(profile.role);
    let query = supabaseClient.from('public_requests').select('*').order('created_at', { ascending: false });
    if (!isStaff) query = query.eq('requester_id', user.id);
    const { data: requests, error } = await query;
    if (error) {
      requestCount.textContent = '—'; newRequestCount.textContent = '—';
      requestsList.innerHTML = `<div class="requests-empty"><i class="fa-solid fa-triangle-exclamation"></i><div>${escapeHtml(error.message)}</div></div>`;
      return;
    }
    const items = requests || [];
    requestCount.textContent = items.length;
    newRequestCount.textContent = items.filter(r => r.status === 'new').length;
    if (!items.length) { requestsList.innerHTML = `<div class="requests-empty"><i class="fa-regular fa-envelope"></i><div>${t('requests.empty','No requests yet.')}</div></div>`; return; }
    requestsList.innerHTML = items.map(r => {
      const date = new Date(r.created_at).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-SA', { dateStyle:'medium', timeStyle:'short' });
      return `<article class="request-item"><div class="request-item-top"><h3>${escapeHtml(r.name || '—')}</h3><span class="request-status">${escapeHtml(r.status || 'new')}</span></div><div class="request-meta"><span><i class="fa-regular fa-envelope"></i> ${escapeHtml(r.email || '')}</span><span><i class="fa-solid fa-tag"></i> ${escapeHtml(r.subject || '')}</span><span><i class="fa-regular fa-clock"></i> ${escapeHtml(date)}</span><span>${escapeHtml(r.id)}</span></div><p class="request-message">${escapeHtml(r.message || '')}</p><div class="request-badge"><i class="fa-solid fa-circle"></i> ${t('requests.newBadge','New request')}</div></article>`;
    }).join('');
  }

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!supabaseClient) { formNote.textContent = 'Supabase is not configured yet.'; return; }
    const data = new FormData(form);
    const user = await getCurrentUser();
    const payload = {
      requester_id: user?.id || null,
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      subject: String(data.get('subject') || '').trim(),
      message: String(data.get('message') || '').trim(),
      status: 'new'
    };
    formNote.textContent = t('form.sending','Sending...');
    const { error } = await supabaseClient.from('public_requests').insert(payload);
    if (error) { formNote.textContent = error.message; return; }
    formNote.textContent = t('form.sent','Your request has been sent.');
    form.reset();
    if (user) await updateRequestDashboard();
  });

  loginOpen.addEventListener('click', async () => {
    const user = await getCurrentUser();
    if (user) openRequests(); else openAuth();
  });
  [authClose, authBackdrop].forEach(el => el.addEventListener('click', closeAuth));
  [requestsClose, requestsBackdrop].forEach(el => el.addEventListener('click', closeRequests));
  authModeToggle.addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!supabaseClient) { loginNote.textContent = 'Supabase is not configured yet.'; return; }
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const submitLabel = authSubmit.querySelector('span');
    const submitIcon = authSubmit.querySelector('i');
    const originalLabel = submitLabel ? submitLabel.textContent : '';
    authSubmit.disabled = true;
    authSubmit.classList.add('is-loading');
    if (submitLabel) submitLabel.textContent = authMode === 'signup' ? 'Creating account...' : 'Signing in...';
    if (submitIcon) submitIcon.className = 'fa-solid fa-spinner fa-spin';
    loginNote.textContent = '';

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) { loginNote.textContent = error.message; return; }
        if (data.session) { closeAuth(); openRequests(); }
        else loginNote.textContent = 'Account created. Check your email to confirm your account, then sign in.';
        return;
      }

      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) { loginNote.textContent = error.message; return; }
      closeAuth();
      openRequests();
    } finally {
      authSubmit.disabled = false;
      authSubmit.classList.remove('is-loading');
      if (submitLabel) submitLabel.textContent = originalLabel;
      if (submitIcon) submitIcon.className = 'fa-solid fa-arrow-right';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    if (supabaseClient) await supabaseClient.auth.signOut();
    closeRequests();
  });
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      loginOpen.querySelector('span').textContent = session ? t('auth.portal','Portal') : t('auth.login','Login');
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAuth(); closeRequests(); } });

  /* =========================================================
     FOOTER YEAR
     ========================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================================================
     SOUND TOGGLE — generative site ambience (WebAudio, no assets)
     ========================================================= */
  const soundBtn = document.getElementById('soundToggle');
  let audioCtx, ambienceNodes, isPlaying = false;

  function buildAmbience() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 340;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.05;

    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();

    return { noise, filter, gain };
  }

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioCtx) ambienceNodes = buildAmbience();
      audioCtx.resume();
      soundBtn.classList.add('on');
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      isPlaying = true;
    } else {
      audioCtx.suspend();
      soundBtn.classList.remove('on');
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      isPlaying = false;
    }
  });

  /* Subtle hover sound cue for primary buttons */
  document.querySelectorAll('.btn, .project-card, .service-card').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      if (!audioCtx || !isPlaying) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.02;
      o.connect(g).connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      o.stop(audioCtx.currentTime + 0.16);
    });
  });

  /* =========================================================
     Click/tap ripple — visible press feedback on buttons & controls
     ========================================================= */
  document.querySelectorAll('.btn, .nav-cta, .lang-toggle, .contact-social a').forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ui-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

})();
