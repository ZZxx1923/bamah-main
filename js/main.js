
  /* Full-screen success message for submitted requests */
  const successModalStyle = document.createElement('style');
  successModalStyle.id = 'basma-success-modal-style';
  successModalStyle.textContent = `
    .basma-success-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 24px; background: rgba(15, 23, 42, .62);
      backdrop-filter: blur(8px);
      opacity: 0; visibility: hidden;
      transition: opacity .25s ease, visibility .25s ease;
    }
    .basma-success-overlay.is-visible { opacity: 1; visibility: visible; }
    .basma-success-card {
      width: min(520px, 100%); background: #fff; border-radius: 24px;
      padding: 36px 30px 30px; text-align: center;
      box-shadow: 0 24px 80px rgba(0,0,0,.22);
      transform: translateY(18px) scale(.96);
      transition: transform .3s cubic-bezier(.2,.8,.2,1);
      direction: rtl;
    }
    .basma-success-overlay.is-visible .basma-success-card {
      transform: translateY(0) scale(1);
    }
    .basma-success-icon {
      width: 76px; height: 76px; margin: 0 auto 18px;
      display: grid; place-items: center; border-radius: 50%;
      background: #dcfce7; color: #16a34a; font-size: 38px;
      font-weight: 800;
    }
    .basma-success-card h3 { margin: 0 0 12px; font-size: 25px; color: #0f172a; }
    .basma-success-card p { margin: 0 auto 24px; max-width: 420px; line-height: 1.9; color: #475569; font-size: 16px; }
    .basma-success-close {
      width: 100%; border: 0; border-radius: 12px; padding: 13px 18px;
      background: #16a34a; color: #fff; font-size: 16px; font-weight: 700;
      cursor: pointer; transition: transform .2s ease, filter .2s ease;
    }
    .basma-success-close:hover { filter: brightness(.95); transform: translateY(-1px); }
  `;
  document.head.appendChild(successModalStyle);

  const successOverlay = document.createElement('div');
  successOverlay.id = 'basma-success-modal';
  successOverlay.className = 'basma-success-overlay';
  successOverlay.innerHTML = `
    <div class="basma-success-card" role="dialog" aria-modal="true" aria-labelledby="basma-success-title">
      <div class="basma-success-icon">✓</div>
      <h3 id="basma-success-title">تم إرسال طلبك بنجاح</h3>
      <p>شكرًا لتواصلك مع بصمة عهد. تم استلام رسالتك بنجاح، وسيتم التواصل معك خلال 24 إلى 48 ساعة.</p>
      <button type="button" class="basma-success-close">حسنًا</button>
    </div>
  `;
  document.body.appendChild(successOverlay);

  const closeSuccessModal = () => {
    successOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };
  successOverlay.querySelector('.basma-success-close').addEventListener('click', closeSuccessModal);
  successOverlay.addEventListener('click', (event) => {
    if (event.target === successOverlay) closeSuccessModal();
  });

  window.showBasmaSuccessModal = () => {
    successOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };

  /* ==========================================================================
     BRANDED TRUCK LOADER — shown while a request is sending, and for 3s
     right after a successful login.
     ========================================================================== */
  const loaderStyle = document.createElement('style');
  loaderStyle.id = 'basma-loader-style';
  loaderStyle.textContent = `
    .basma-loader-overlay {
      position: fixed; inset: 0; z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 22px;
      background: rgba(8, 9, 10, .82);
      backdrop-filter: blur(10px);
      opacity: 0; visibility: hidden;
      transition: opacity .25s ease, visibility .25s ease;
    }
    .basma-loader-overlay.is-visible { opacity: 1; visibility: visible; }
    .basma-loader-overlay .loader { width: fit-content; height: fit-content; display: flex; align-items: center; justify-content: center; }
    .basma-loader-overlay .truckWrapper { width: 260px; height: 130px; display: flex; flex-direction: column; position: relative; align-items: center; justify-content: flex-end; overflow-x: hidden; }
    .basma-loader-overlay .truckBody { width: 169px; height: fit-content; margin-bottom: 8px; animation: basmaTruckMotion 1s linear infinite; }
    @keyframes basmaTruckMotion { 0% { transform: translateY(0px); } 50% { transform: translateY(3px); } 100% { transform: translateY(0px); } }
    .basma-loader-overlay .truckTires { width: 169px; height: fit-content; display: flex; align-items: center; justify-content: space-between; padding: 0px 13px 0px 19px; position: absolute; bottom: 0; }
    .basma-loader-overlay .truckTires svg { width: 31px; }
    .basma-loader-overlay .road { width: 100%; height: 1.5px; background-color: #f4f4f1; position: relative; bottom: 0; align-self: flex-end; border-radius: 3px; }
    .basma-loader-overlay .road::before { content: ""; position: absolute; width: 20px; height: 100%; background-color: #f4f4f1; right: -50%; border-radius: 3px; animation: basmaRoadMotion 1.4s linear infinite; border-left: 10px solid #08090a; }
    .basma-loader-overlay .road::after { content: ""; position: absolute; width: 10px; height: 100%; background-color: #f4f4f1; right: -65%; border-radius: 3px; animation: basmaRoadMotion 1.4s linear infinite; border-left: 4px solid #08090a; }
    .basma-loader-overlay .lampPost { position: absolute; bottom: 0; right: -90%; height: 90px; animation: basmaRoadMotion 1.4s linear infinite; }
    @keyframes basmaRoadMotion { 0% { transform: translateX(0px); } 100% { transform: translateX(-350px); } }
    .basma-loader-label { font: 600 13px/1.7 'JetBrains Mono', monospace; letter-spacing: .04em; color: #f7931e; text-align: center; max-width: 340px; padding: 0 20px; }
  `;
  document.head.appendChild(loaderStyle);

  const loaderOverlay = document.createElement('div');
  loaderOverlay.id = 'basma-loader-overlay';
  loaderOverlay.className = 'basma-loader-overlay';
  loaderOverlay.innerHTML = `
    <div class="loader">
      <div class="truckWrapper">
        <div class="truckBody">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" class="trucksvg">
            <defs>
              <linearGradient id="basmaTruckLogoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f7931e"/>
                <stop offset="1" stop-color="#c9701a"/>
              </linearGradient>
            </defs>
            <path stroke-width="3" stroke="#282828" fill="#F83D3D" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
            <path stroke-width="3" stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
            <path stroke-width="2" stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
            <rect stroke-width="2" stroke="#282828" fill="#FFFCAB" rx="1" height="7" width="5" y="63" x="187" />
            <rect stroke-width="2" stroke="#282828" fill="#282828" rx="1" height="11" width="4" y="81" x="193" />
            <rect stroke-width="3" stroke="#282828" fill="#DFDFDF" rx="2.5" height="90" width="121" y="1.5" x="6.5" />
            <rect stroke-width="2" stroke="#282828" fill="#DFDFDF" rx="2" height="4" width="6" y="84" x="1" />
            <rect x="50" y="55" width="34" height="34" rx="7" fill="url(#basmaTruckLogoGrad)" />
            <text x="67" y="77" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif" font-weight="700" font-size="15" fill="#08090a">BA</text>
            <text x="67" y="28" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif" font-weight="700" font-size="17" letter-spacing=".5" fill="#282828">BASMA</text>
            <text x="67" y="46" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="12" letter-spacing="3" fill="#c9701a">AHED</text>
          </svg>
        </div>
        <div class="truckTires">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
            <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15" />
            <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
            <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15" />
            <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
          </svg>
        </div>
        <div class="road"></div>
        <svg xml:space="preserve" viewBox="0 0 453.459 453.459" xmlns="http://www.w3.org/2000/svg" fill="#f4f4f1" class="lampPost">
          <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
      c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
      c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
      c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
      h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
      v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
      V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
      M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
      h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
        </svg>
      </div>
    </div>
    <div class="basma-loader-label" id="basmaLoaderLabel">جارٍ الإرسال...</div>
  `;
  document.body.appendChild(loaderOverlay);

  const basmaLoaderLabelEl = loaderOverlay.querySelector('#basmaLoaderLabel');

  window.showBasmaLoader = (label) => {
    if (label) basmaLoaderLabelEl.textContent = label;
    loaderOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };
  window.hideBasmaLoader = () => {
    loaderOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };
  // Shows the loader for at least `minMs` milliseconds, even if the wrapped
  // action finishes sooner, so it doesn't flash on screen too briefly.
  window.showBasmaLoaderFor = (minMs, label) => {
    window.showBasmaLoader(label);
    return new Promise((resolve) => setTimeout(() => { window.hideBasmaLoader(); resolve(); }, minMs));
  };

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
      'auth.login': 'Login', 'auth.title': 'Sign in to your account', 'auth.desc': 'Access your requests and manage incoming messages.', 'auth.portal': 'Portal', 'auth.email': 'Email', 'auth.password': 'Password', 'auth.logout': 'Logout', 'auth.invalid': 'Invalid email or password.', 'auth.demo': '',
      'requests.title': 'Requests', 'requests.total': 'Total Requests', 'requests.new': 'New Requests', 'requests.empty': 'No requests yet. Messages submitted through the contact form will appear here.', 'requests.newBadge': 'New request', 'requests.status.new': 'Waiting', 'requests.status.in_progress': 'In progress', 'requests.status.completed': 'Completed', 'requests.delete': 'Delete', 'requests.deleteConfirm': 'Delete this request? This cannot be undone.', 'requests.filter.active': 'Active', 'requests.filter.completed': 'Completed', 'requests.filter.all': 'All', 'requests.emptyFiltered': 'No requests in this view.', 'loader.sending': 'Sending your request...', 'loader.signingIn': 'Signing you in...', 'loader.thanks': 'Thank you for trusting us! We will be in touch within 24 to 48 hours.',
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
      'projects.district': '03 — PROJECTS', 'projects.heading': 'Projects We\u2019ve Delivered',
      'projects.sub': 'A look back at megaprojects we\u2019ve worked on, shaping the Kingdom\u2019s skyline.',
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
      'auth.login': 'تسجيل الدخول', 'auth.title': 'تسجيل الدخول إلى حسابك', 'auth.desc': 'الوصول إلى الطلبات وإدارة الرسائل الواردة.', 'auth.portal': 'البوابة', 'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور', 'auth.logout': 'تسجيل الخروج', 'auth.invalid': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'auth.demo': '',
      'requests.title': 'الطلبات', 'requests.total': 'إجمالي الطلبات', 'requests.new': 'الطلبات الجديدة', 'requests.empty': 'لا توجد طلبات حتى الآن. ستظهر الرسائل المرسلة من نموذج التواصل هنا.', 'requests.newBadge': 'طلب جديد', 'requests.status.new': 'في الانتظار', 'requests.status.in_progress': 'قيد التنفيذ', 'requests.status.completed': 'مكتمل', 'requests.delete': 'حذف', 'requests.deleteConfirm': 'هل تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.', 'requests.filter.active': 'النشطة', 'requests.filter.completed': 'المكتملة', 'requests.filter.all': 'الكل', 'requests.emptyFiltered': 'لا توجد طلبات في هذا العرض.', 'loader.sending': 'جارٍ إرسال طلبك...', 'loader.signingIn': 'جارٍ تسجيل الدخول...', 'loader.thanks': 'شكرًا لثقتك فينا! تم استلام طلبك بنجاح، وسنتواصل معك خلال 24 إلى 48 ساعة.',
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
      'projects.district': '٠٣ — المشاريع', 'projects.heading': 'مشاريعنا السابقة',
      'projects.sub': 'نظرة على أبرز المشاريع الكبرى التي عملنا عليها وساهمنا في تشكيل ملامح أفق المملكة من خلالها.',
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

  // Global translation helper used by authentication, requests, forms, and UI messages.
  // The previous version called t(...) in several functions without defining it,
  // which caused: ReferenceError: t is not defined.
  const t = (key, fallback = key) => {
    const translations = T[currentLang] || T.en || {};
    const value = translations[key];
    return value !== undefined && value !== null && value !== '' ? value : fallback;
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
  const requestsNote = document.getElementById('requestsNote');
  const requestsFilters = document.getElementById('requestsFilters');
  let requestsFilter = 'active';
  const requestCount = document.getElementById('requestCount');
  const newRequestCount = document.getElementById('newRequestCount');
  const logoutBtn = document.getElementById('logoutBtn');
  const authSubmit = document.getElementById('authSubmit');
  const authTitle = document.getElementById('authTitle');
  const authDesc = document.getElementById('authDesc');

  const setAuthMode = () => {
    authTitle.textContent = t('auth.title', 'Sign in to your account');
    authDesc.textContent = t('auth.desc', 'Access your requests and manage incoming messages.');
    authSubmit.querySelector('span').textContent = t('auth.login', 'Login');
    loginNote.textContent = '';
  };

  const openAuth = () => { setAuthMode(); authModal.classList.add('is-open'); authModal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; setTimeout(() => document.getElementById('loginEmail')?.focus(), 50); };
  const closeAuth = () => { authModal.classList.remove('is-open'); authModal.setAttribute('aria-hidden','true'); loginNote.textContent=''; document.body.style.overflow = ''; };
  const openRequests = async () => { await updateRequestDashboard(); requestsPanel.classList.add('is-open'); requestsPanel.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
  const closeRequests = () => { requestsPanel.classList.remove('is-open'); requestsPanel.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };

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
    requestsNote.textContent = '';
    requestsNote.classList.remove('is-error');
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
    const visibleItems = requestsFilter === 'all'
      ? items
      : requestsFilter === 'completed'
        ? items.filter(r => (r.status || 'new') === 'completed')
        : items.filter(r => (r.status || 'new') !== 'completed');
    if (!items.length) { requestsList.innerHTML = `<div class="requests-empty"><i class="fa-regular fa-envelope"></i><div>${t('requests.empty','No requests yet.')}</div></div>`; return; }
    if (!visibleItems.length) { requestsList.innerHTML = `<div class="requests-empty"><i class="fa-solid fa-check-double"></i><div>${t('requests.emptyFiltered','No requests in this view.')}</div></div>`; return; }
    requestsList.innerHTML = visibleItems.map(r => {
      const date = new Date(r.created_at).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-SA', { dateStyle:'medium', timeStyle:'short' });
      const status = r.status || 'new';
      const statusLabel = t(`requests.status.${status}`, status);
      const statusControl = isStaff
        ? `<select class="request-status-select" data-request-status="${escapeHtml(r.id)}" aria-label="Request status"><option value="new" ${status==='new'?'selected':''}>${t('requests.status.new','Waiting')}</option><option value="in_progress" ${status==='in_progress'?'selected':''}>${t('requests.status.in_progress','In progress')}</option><option value="completed" ${status==='completed'?'selected':''}>${t('requests.status.completed','Completed')}</option></select>`
        : `<span class="request-status request-status-${escapeHtml(status)}">${escapeHtml(statusLabel)}</span>`;
      const deleteControl = isStaff
        ? `<button type="button" class="request-delete-btn" data-request-delete="${escapeHtml(r.id)}" aria-label="${escapeHtml(t('requests.delete','Delete'))}" title="${escapeHtml(t('requests.delete','Delete'))}"><i class="fa-solid fa-trash-can"></i></button>`
        : '';
      const itemClass = status === 'completed' ? 'request-item is-completed' : 'request-item';
      return `<article class="${itemClass}"><div class="request-item-top"><h3>${escapeHtml(r.name || '—')}</h3><div class="request-item-controls">${statusControl}${deleteControl}</div></div><div class="request-meta"><span><i class="fa-regular fa-envelope"></i> ${escapeHtml(r.email || '')}</span><span><i class="fa-solid fa-tag"></i> ${escapeHtml(r.subject || '')}</span><span><i class="fa-regular fa-clock"></i> ${escapeHtml(date)}</span><span>${escapeHtml(r.id)}</span></div><p class="request-message">${escapeHtml(r.message || '')}</p></article>`;
    }).join('');
    if (isStaff) {
      requestsList.querySelectorAll('[data-request-status]').forEach(select => {
        select.addEventListener('change', async (event) => {
          const id = event.target.dataset.requestStatus;
          const newValue = event.target.value;
          event.target.disabled = true;
          const { data, error } = await supabaseClient.from('public_requests').update({ status: newValue }).eq('id', id).select();
          event.target.disabled = false;
          if (error) {
            console.error('Failed to update request status', error);
            requestsNote.textContent = error.message || 'Failed to update status.';
            requestsNote.classList.add('is-error');
            return;
          }
          if (!data || !data.length) {
            console.warn('Status update affected 0 rows — likely blocked by a Row Level Security policy.', { id, newValue });
            requestsNote.textContent = 'Update was blocked (0 rows changed). This is usually a Supabase Row Level Security permission issue — check that your account has an active manager/supervisor role.';
            requestsNote.classList.add('is-error');
            return;
          }
          await updateRequestDashboard();
        });
      });
      requestsList.querySelectorAll('[data-request-delete]').forEach(btn => {
        btn.addEventListener('click', async (event) => {
          const id = event.currentTarget.dataset.requestDelete;
          const confirmed = window.confirm(t('requests.deleteConfirm', 'Delete this request? This cannot be undone.'));
          if (!confirmed) return;
          event.currentTarget.disabled = true;
          const { data, error } = await supabaseClient.from('public_requests').delete().eq('id', id).select();
          if (error) {
            console.error('Failed to delete request', error);
            requestsNote.textContent = error.message || 'Failed to delete request.';
            requestsNote.classList.add('is-error');
            event.currentTarget.disabled = false;
            return;
          }
          if (!data || !data.length) {
            console.warn('Delete affected 0 rows — likely blocked by a Row Level Security policy.', { id });
            requestsNote.textContent = 'Delete was blocked (0 rows changed). Make sure the delete policy from supabase-shared-requests.sql has been run in your Supabase project.';
            requestsNote.classList.add('is-error');
            event.currentTarget.disabled = false;
            return;
          }
          await updateRequestDashboard();
        });
      });
    }
  }

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formNote.classList.remove('is-success');
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
    window.showBasmaLoader(t('loader.sending', 'Sending your request...'));
    const { error } = await supabaseClient.from('public_requests').insert(payload);
    if (error) { window.hideBasmaLoader(); formNote.textContent = error.message; return; }
    window.showBasmaLoader(t('loader.thanks', 'Thank you for trusting us! We will be in touch within 24 to 48 hours.'));
    await new Promise((resolve) => setTimeout(resolve, 3500));
    window.hideBasmaLoader();
    formNote.innerHTML = `<strong>${t('form.thanksTitle','Thank you for contacting us')}</strong><br>${t('form.thanks','Your request has been received successfully. We will contact you within 24 to 48 hours.')}`;
    formNote.classList.add('is-success');
    form.reset();
    if (user) await updateRequestDashboard();
  });

  loginOpen.addEventListener('click', async () => {
    const user = await getCurrentUser();
    if (user) openRequests(); else openAuth();
  });
  [authClose, authBackdrop].forEach(el => el.addEventListener('click', closeAuth));
  [requestsClose, requestsBackdrop].forEach(el => el.addEventListener('click', closeRequests));
  requestsFilters.querySelectorAll('[data-request-filter]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (requestsFilter === btn.dataset.requestFilter) return;
      requestsFilter = btn.dataset.requestFilter;
      requestsFilters.querySelectorAll('[data-request-filter]').forEach(b => b.classList.toggle('is-active', b === btn));
      await updateRequestDashboard();
    });
  });

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
    if (submitLabel) submitLabel.textContent = 'Signing in...';
    if (submitIcon) submitIcon.className = 'fa-solid fa-spinner fa-spin';
    loginNote.textContent = '';

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) { loginNote.textContent = error.message; return; }
      closeAuth();
      await window.showBasmaLoaderFor(3000, t('loader.signingIn', 'Signing you in...'));
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
      loginOpen.querySelector('span').textContent = session ? 'Portal' : 'Login';
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
