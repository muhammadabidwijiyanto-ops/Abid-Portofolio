/**
 * ==========================================================================
 * THE ANALYTICAL ARCHITECT — JAVASCRIPT INTERACTIONS
 * Portfolio of Muhammad Abid Wijiyanto
 * Mathematics | Data Analysis, Business & Operations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getFocusableElements = (container) => Array.from(container?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0);

    const keepFocusInside = (event, container) => {
        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableElements(container);
        if (focusableElements.length === 0) {
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const focusIsOutside = !container.contains(document.activeElement);

        if (event.shiftKey && (document.activeElement === firstElement || focusIsOutside)) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutside)) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    /* ----------------------------------------------------------------------
       1. STICKY NAVBAR SCROLL BLUR EFFECT
       ---------------------------------------------------------------------- */
    const headerWrapper = document.getElementById('headerWrapper');
    const scrollThreshold = 35;

    const handleNavbarScroll = () => {
        if (!headerWrapper) return;
        if (window.scrollY > scrollThreshold) {
            headerWrapper.classList.add('scrolled');
        } else {
            headerWrapper.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Initial check

    /* ----------------------------------------------------------------------
       2. SCROLLSPY (ACTIVE NAVIGATION LINK TRACKER)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-links .mobile-nav-item');

    const updateActiveNav = (currentId) => {
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        mobileNavItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // IntersectionObserver for robust section detection
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    updateActiveNav(currentId);
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Scroll listener for bottom-of-page edge case detection
    window.addEventListener('scroll', () => {
        // If at bottom of page, highlight contact
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            updateActiveNav('contact');
        }
    }, { passive: true });

    /* ----------------------------------------------------------------------
       3. MOBILE NAVIGATION DRAWER
       ---------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileDrawerOverlay');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const backgroundRegions = [
        document.getElementById('headerWrapper'),
        document.querySelector('main'),
        document.querySelector('footer')
    ].filter(Boolean);
    let drawerPreviousOverflow = '';

    const openDrawer = () => {
        if (!mobileDrawer || !mobileOverlay) return;
        drawerPreviousOverflow = document.body.style.overflow;
        mobileDrawer.removeAttribute('inert');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.add('active');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        backgroundRegions.forEach((region) => { region.inert = true; });
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
        mobileDrawerClose?.focus();
    };

    const closeDrawer = (restoreFocus = true) => {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileDrawer.setAttribute('inert', '');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        backgroundRegions.forEach((region) => { region.inert = false; });
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = drawerPreviousOverflow;
        if (restoreFocus) mobileToggle?.focus();
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer?.classList.contains('open');
            if (isOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeDrawer);
    }

    mobileDrawerClose?.addEventListener('click', () => closeDrawer());

    // Close mobile drawer when clicking navigation links inside it
    if (mobileNavItems.length > 0) {
        mobileNavItems.forEach(link => {
            link.addEventListener('click', () => {
                const destination = document.querySelector(link.getAttribute('href'));
                closeDrawer(false);
                if (destination) {
                    destination.setAttribute('tabindex', '-1');
                    destination.focus({ preventScroll: true });
                }
            });
        });
    }

    // Keep keyboard focus in the open navigation drawer and restore it on close.
    document.addEventListener('keydown', (e) => {
        if (!mobileDrawer?.classList.contains('open')) return;
        if (e.key === 'Escape') closeDrawer();
        else keepFocusInside(e, mobileDrawer);
    });

    /* ----------------------------------------------------------------------
       4. EXPERIENCE CATEGORY FILTER TABS
       ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.experience-tabs-nav .exp-tab-btn');
    const categoryGroups = document.querySelectorAll('.exp-category-group');

    if (filterButtons.length > 0 && categoryGroups.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter');

                // Update active button state
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                // Filter category display with smooth transition
                categoryGroups.forEach(group => {
                    const groupCat = group.getAttribute('data-category');

                    if (targetFilter === 'all' || groupCat === targetFilter) {
                        group.style.display = 'block';
                        if (!prefersReducedMotion) {
                            group.style.opacity = '0';
                            group.style.transform = 'translateY(6px)';
                            setTimeout(() => {
                                group.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
                                group.style.opacity = '1';
                                group.style.transform = 'translateY(0)';
                            }, 10);
                        }
                    } else {
                        group.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------------------
       5. BACK TO TOP BUTTON
       ---------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. PROJECT DETAIL MODAL
       ---------------------------------------------------------------------- */

    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalBody = document.getElementById('project-modal-body');
    const projectModalClose = projectModal?.querySelector('.project-modal-close');

    const projectDetails = {
        nyc: {
            category: 'DATA ANALYSIS & EXPLORATORY DATA ANALYSIS',
            title: 'NYC Flights Performance Analysis & Dashboard',
            summary: 'Analisis performa penerbangan di tiga bandara utama New York pada tahun 2013. Proyek ini mengeksplorasi pola keterlambatan, performa maskapai, bandara, dan faktor operasional penerbangan.',
            gallery: [
                { src: "assets/images/projects/nyc-flights/nyc-dashboard-overview.jpg", webpSrcset: "assets/images/projects/nyc-flights/nyc-dashboard-overview-480.webp 480w, assets/images/projects/nyc-flights/nyc-dashboard-overview-640.webp 640w, assets/images/projects/nyc-flights/nyc-dashboard-overview-960.webp 960w, assets/images/projects/nyc-flights/nyc-dashboard-overview-1280.webp 1280w, assets/images/projects/nyc-flights/nyc-dashboard-overview-2048.webp 2048w", webpSizes: "(max-width: 380px) calc(100vw - 32px), (max-width: 600px) calc(100vw - 40px), (max-width: 700px) calc(50vw - 27px), (max-width: 936px) calc(50vw - 68px), 405px", width: 2048, height: 1170, alt: "Dashboard overview — ringkasan performa penerbangan", caption: "Dashboard overview — ringkasan performa penerbangan" },
                { src: "assets/images/projects/nyc-flights/nyc-dashboard-airlines.jpg", webpSrcset: "assets/images/projects/nyc-flights/nyc-dashboard-airlines-480.webp 480w, assets/images/projects/nyc-flights/nyc-dashboard-airlines-640.webp 640w, assets/images/projects/nyc-flights/nyc-dashboard-airlines-960.webp 960w, assets/images/projects/nyc-flights/nyc-dashboard-airlines-1280.webp 1280w, assets/images/projects/nyc-flights/nyc-dashboard-airlines-2048.webp 2048w", webpSizes: "(max-width: 380px) calc(100vw - 32px), (max-width: 600px) calc(100vw - 40px), (max-width: 700px) calc(50vw - 27px), (max-width: 936px) calc(50vw - 68px), 405px", width: 2048, height: 1170, alt: "Analisis performa maskapai", caption: "Analisis performa maskapai" },
                { src: "assets/images/projects/nyc-flights/nyc-dashboard-airports.jpg", webpSrcset: "assets/images/projects/nyc-flights/nyc-dashboard-airports-480.webp 480w, assets/images/projects/nyc-flights/nyc-dashboard-airports-640.webp 640w, assets/images/projects/nyc-flights/nyc-dashboard-airports-960.webp 960w, assets/images/projects/nyc-flights/nyc-dashboard-airports-1280.webp 1280w, assets/images/projects/nyc-flights/nyc-dashboard-airports-2048.webp 2048w", webpSizes: "(max-width: 380px) calc(100vw - 32px), (max-width: 600px) calc(100vw - 40px), (max-width: 700px) calc(50vw - 27px), (max-width: 936px) calc(50vw - 68px), 405px", width: 2048, height: 1151, alt: "Analisis performa bandara", caption: "Analisis performa bandara" }
            ],
            stats: [
                ['327,346', 'Observasi penerbangan'],
                ['39.02%', 'Departure delay rate'],
                ['12.56 menit', 'Rata-rata departure delay'],
                ['60.98%', 'On-time departure']
            ],
            sections: [
                {
                    title: 'Ruang Lingkup Analisis',
                    text: 'Eksplorasi volume penerbangan, pola keterlambatan berdasarkan waktu, perbandingan performa maskapai, serta analisis bandara keberangkatan JFK, LGA, dan EWR.'
                },
                {
                    title: 'Temuan Utama',
                    text: 'US Airways mencatat delay rate terendah sebesar 27.27%, sedangkan Frontier Airlines tertinggi sebesar 54.51%. EWR memiliki porsi volume penerbangan terbesar, yaitu 35.8%.'
                },
                {
                    title: 'Metodologi & Tools',
                    text: 'Data cleaning, exploratory data analysis (EDA), analisis statistik deskriptif, visualisasi data, Python, Pandas, Matplotlib, Seaborn, dan Google Looker Studio.'
                }
            ],
            tools: ['Python', 'Pandas', 'EDA', 'Matplotlib', 'Seaborn', 'Looker Studio'],
            links: [
                ['GitHub Repository', 'https://github.com/muhammadabidwijiyanto-ops/PROJEK-ANALIS-DATA-EKSPLORASI'],
                ['Interactive Dashboard', 'https://datastudio.google.com/reporting/0da66950-09cc-4666-aaf1-cded388b9e6a']
            ]
        },

        courier: {
            category: 'ALGORITHMS & COMPUTATIONAL THINKING',
            title: 'Smart Courier Route Recommendation',
            summary: 'Implementasi algoritma graf untuk menentukan rute pengiriman terpendek dari gudang menuju beberapa titik rumah menggunakan pendekatan shortest path.',
            gallery: [
                { src: "assets/images/projects/smart-courier/courier-visual-01.png", webpSrc: "assets/images/projects/smart-courier/courier-visual-01.webp", width: 968, height: 518, alt: "Visualisasi graf dan rute terpendek", caption: "Visualisasi graf dan rute terpendek" },
                { src: "assets/images/projects/smart-courier/courier-visual-02.png", webpSrc: "assets/images/projects/smart-courier/courier-visual-02.webp", width: 976, height: 528, alt: "Perbandingan performa algoritma", caption: "Perbandingan performa algoritma" },
                { src: "assets/images/projects/smart-courier/courier-visual-03.png", webpSrc: "assets/images/projects/smart-courier/courier-visual-03.webp", width: 1003, height: 549, alt: "Desain dan arsitektur sistem", caption: "Desain dan arsitektur sistem" },
                { src: "assets/images/projects/smart-courier/courier-visual-04.png", webpSrc: "assets/images/projects/smart-courier/courier-visual-04.webp", width: 957, height: 515, alt: "Studi kasus dan kebutuhan sistem", caption: "Studi kasus dan kebutuhan sistem" }
            ],
            stats: [
                ['15', 'Node'],
                ['19', 'Edge'],
                ['12 km', 'Total rute terpendek'],
                ['24 menit', 'Estimasi waktu perjalanan']
            ],
            sections: [
                {
                    title: 'Representasi Graf',
                    text: 'Jaringan direpresentasikan sebagai graf tak berarah berbobot dengan 15 node, terdiri dari satu gudang dan 14 rumah tujuan, serta 19 edge dengan total bobot jarak 63 km.'
                },
                {
                    title: 'Pendekatan Algoritmik',
                    text: 'Proyek mengimplementasikan adjacency list, Dijkstra secara manual, dan Floyd–Warshall untuk mempelajari pencarian lintasan terpendek.'
                },
                {
                    title: 'Hasil Rute',
                    text: 'Rute yang diperoleh adalah Warehouse → B → F → L → M dengan total jarak 12 km. Estimasi waktu perjalanan adalah 24 menit dengan asumsi kecepatan rata-rata 30 km/jam.'
                }
            ],
            tools: ['Python', 'Graph Theory', 'Dijkstra', 'Floyd–Warshall', 'Adjacency List'],
            links: [
                ['GitHub Repository', 'https://github.com/muhammadabidwijiyanto-ops/PROJEK-ALGORITMA-DAN-STRUKTUR-DATA']
            ]
        },

        himeng: {
            category: 'STATISTICAL ANALYSIS & SOCIAL IMPACT',
            title: 'Evaluasi HIMATIKA Mengajar Gen 5',
            summary: 'Evaluasi perubahan hasil belajar peserta didik setelah kegiatan HIMATIKA Mengajar Gen 5 di SDN Cikoneng. Analisis menggunakan pendekatan kuantitatif pretest dan posttest.',
            gallery: [
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-01.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-01.webp", width: 249, height: 152, alt: "Perbandingan rata-rata nilai pretest dan posttest", caption: "Perbandingan rata-rata nilai pretest dan posttest" },
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-02.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-02.webp", width: 250, height: 339, alt: "Distribusi perubahan nilai peserta", caption: "Distribusi perubahan nilai peserta" },
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-03.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-03.webp", width: 249, height: 167, alt: "Effect size program HIMATIKA Mengajar", caption: "Effect size program HIMATIKA Mengajar" },
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-04.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-04.webp", width: 246, height: 376, alt: "Visualisasi ringkasan hasil analisis", caption: "Visualisasi ringkasan hasil analisis" },
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-05.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-05.webp", width: 250, height: 151, alt: "Perbandingan hasil berdasarkan kelas", caption: "Perbandingan hasil berdasarkan kelas" },
                { src: "assets/images/projects/himatika-mengajar/himeng-visual-06.png", webpSrc: "assets/images/projects/himatika-mengajar/himeng-visual-06.webp", width: 513, height: 310, alt: "Rekapitulasi data hasil evaluasi", caption: "Rekapitulasi data hasil evaluasi" }
            ],
            stats: [
                ['83', 'Peserta didik'],
                ['54.94', 'Rata-rata pretest'],
                ['68.11', 'Rata-rata posttest'],
                ['+13.17', 'Perubahan rata-rata']
            ],
            sections: [
                {
                    title: 'Desain Evaluasi',
                    text: 'Penelitian menggunakan desain One-Group Pretest–Posttest pada 83 peserta didik kelas II sampai VI SDN Cikoneng.'
                },
                {
                    title: 'Hasil Pengujian',
                    text: 'Uji Wilcoxon menghasilkan p-value 0.0053. Nilai N-Gain sebesar 0.148 termasuk kategori rendah. Secara keseluruhan rata-rata posttest meningkat, tetapi kelas III dan V mengalami penurunan.'
                },
                {
                    title: 'Interpretasi',
                    text: 'Hasil menunjukkan adanya perubahan skor setelah kegiatan. Namun, peningkatan rata-rata tidak terjadi secara merata pada setiap kelas. Desain satu kelompok juga membatasi kesimpulan kausal.'
                }
            ],
            tools: ['R', 'Statistical Analysis', 'Wilcoxon Test', 'N-Gain', 'Data Visualization'],
            links: [
                ['GitHub Repository', 'https://github.com/muhammadabidwijiyanto-ops/PROJEK-HIMENGxPRRISMA']
            ]
        },

        model: {
            category: 'STATISTICAL MODELING & ECONOMETRICS',
            title: 'Campus Electric Transportation Satisfaction',
            summary: 'Pemodelan faktor-faktor yang berhubungan dengan kepuasan pengguna layanan transportasi listrik kampus UIN Jakarta menggunakan regresi linear dan pengembangan model kandidat.',
            gallery: [
                { src: "assets/images/projects/model-linear/model-linear-visual-01.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-01.webp", width: 447, height: 305, alt: "Ringkasan analisis kepuasan pengguna", caption: "Ringkasan analisis kepuasan pengguna" },
                { src: "assets/images/projects/model-linear/model-linear-visual-03.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-03.webp", width: 304, height: 259, alt: "Matriks korelasi antarvariabel", caption: "Matriks korelasi antarvariabel" },
                { src: "assets/images/projects/model-linear/model-linear-visual-04.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-04.webp", width: 261, height: 199, alt: "Normal Q-Q plot residual", caption: "Normal Q-Q plot residual" },
                { src: "assets/images/projects/model-linear/model-linear-visual-05.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-05.webp", width: 258, height: 200, alt: "Distribusi residual model", caption: "Distribusi residual model" },
                { src: "assets/images/projects/model-linear/model-linear-visual-06.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-06.webp", width: 394, height: 273, alt: "Diagnostik residual model", caption: "Diagnostik residual model" },
                { src: "assets/images/projects/model-linear/model-linear-visual-07.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-07.webp", width: 429, height: 325, alt: "Hubungan kemudahan akses dan kepuasan", caption: "Hubungan kemudahan akses dan kepuasan" },
                { src: "assets/images/projects/model-linear/model-linear-visual-08.png", webpSrc: "assets/images/projects/model-linear/model-linear-visual-08.webp", width: 433, height: 327, alt: "Interaksi kemudahan akses dan kecepatan", caption: "Interaksi kemudahan akses dan kecepatan" }
            ],
            stats: [
                ['134', 'Responden valid'],
                ['0.6436', 'Adjusted R²'],
                ['0.5068', '10-fold CV RMSE'],
                ['0.4163', 'MAE']
            ],
            sections: [
                {
                    title: 'Variabel Penelitian',
                    text: 'Variabel respons adalah kepuasan pengguna. Prediktor meliputi kemudahan akses, kenyamanan, kecepatan, keamanan, frekuensi penggunaan, dan kepemilikan kendaraan pribadi.'
                },
                {
                    title: 'Pemodelan',
                    text: 'Analisis dilakukan menggunakan R. Model IP2 menggabungkan komponen polinomial dan interaksi untuk mengevaluasi hubungan yang tidak sepenuhnya linear.'
                },
                {
                    title: 'Hasil Model',
                    text: 'Model IP2 memperoleh Adjusted R² sebesar 0.6436 dan 10-fold cross-validation RMSE sebesar 0.5068. Prediktor signifikan mencakup kecepatan, kenyamanan, keamanan, kepemilikan kendaraan pribadi, akses kuadrat, serta interaksi akses dan kecepatan.'
                }
            ],
            tools: ['R', 'Multiple Linear Regression', 'Model Selection', 'Interaction', 'Polynomial Regression', 'Cross-Validation'],
            links: [
                ['GitHub Repository', 'https://github.com/muhammadabidwijiyanto-ops/PROJEK-MODEL-LINEAR']
            ]
        },

        imc: {
            category: 'NATIONAL COMPETITION & MACHINE LEARNING',
            title: 'IMC 2026 — Infographic Challenge',
            summary: 'Karya infografis ilmiah dalam IPB Mathematics Challenge 2026 bersama tim Wani Fit-in Histogram (WFH), dengan topik prediksi risiko keterlambatan penerbangan menggunakan Machine Learning.',
            gallery: [
                { src: "assets/images/projects/imc-2026/imc-team-poster.webp", width: 1152, height: 1536, alt: "Poster tim Wani Fit-in Histogram (WFH)", caption: "Poster tim Wani Fit-in Histogram (WFH)" },
                { src: "assets/images/projects/imc-2026/imc-documentation-01.jpg", width: 1536, height: 827, alt: "Dokumentasi kegiatan IMC 2026", caption: "Dokumentasi kegiatan IMC 2026" }
            ],
            stats: [
                ['National Finalist', 'Pencapaian kompetisi'],
                ['WFH', 'Nama tim'],
                ['IMC26IC32', 'Team ID'],
                ['6.88 juta', 'Data penerbangan dalam karya']
            ],
            sections: [
                {
                    title: 'Karya Kompetisi',
                    text: 'Sebelum Terlambat: Memprediksi Risiko Delay Penerbangan dengan Machine Learning.'
                },
                {
                    title: 'Kontribusi',
                    text: 'Mengembangkan dan menyajikan gagasan analisis prediktif dalam format infografis ilmiah untuk mengomunikasikan penerapan Machine Learning pada permasalahan keterlambatan penerbangan.'
                },
                {
                    title: 'Pencapaian',
                    text: 'Tim Wani Fit-in Histogram (WFH) berhasil menjadi National Finalist dalam Infographic Challenge yang diselenggarakan oleh Gugus Mahasiswa Matematika IPB University.'
                }
            ],
            tools: ['Machine Learning', 'Data Analysis', 'Infographic Design', 'Statistical Communication'],
            links: [
                ['GitHub Repository', 'https://github.com/muhammadabidwijiyanto-ops/LOMBA-IMC-2026'],
                ['Sertifikat National Finalist', 'assets/images/projects/imc-2026/imc-finalist-certificate.pdf']
            ]
        },

        work: {
            type: 'EXPERIENCE',
            category: 'PROFESSIONAL EXPERIENCE',
            title: 'Staf Administrasi dan Operasional — CV Panji Jaya Abadi',
            summary: 'Mendukung pencatatan transaksi, pengelolaan data operasional, pelayanan pelanggan, dan kelancaran administrasi harian.',
            stats: [['Des 2025', 'Mulai bergabung'], ['10 truk/hari', 'Skala data operasional'], ['Administrasi', 'Fokus pekerjaan'], ['Operasional', 'Area kontribusi']],
            sections: [
                { title: 'Tanggung Jawab', text: 'Mencatat transaksi dan setoran, mengolah data operasional termasuk berat ayam serta data logistik pengiriman, menyiapkan bon pelanggan, dan membantu pelayanan pelanggan.' },
                { title: 'Kontribusi', text: 'Mendukung akurasi pencatatan dan kelancaran proses administrasi serta operasional harian.' }
            ],
            tools: ['Administrasi', 'Data Recording', 'Operational Support', 'Customer Service'],
            links: []
        },
        invers: {
            type: 'ORGANIZATIONAL EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · 2026–2027',
            title: 'Staff Departemen INVERS',
            summary: 'Terlibat dalam kegiatan Departemen INVERS HIMATIKA UIN Jakarta pada periode 2026–2027.',
            gallery: [
                { src: 'assets/images/experience/invers/invers-01.jpg', width: 1536, height: 1024, alt: 'Foto Staff Invers HIMATIKA', caption: 'Foto Staff Invers HIMATIKA' },
                { src: 'assets/images/experience/invers/invers-02.jpg', width: 1536, height: 1024, alt: 'Foto bersama staff HIMATIKA', caption: 'Foto bersama staff HIMATIKA' }
            ],
            sections: [
                { title: 'Peran', text: 'Staff Departemen INVERS HIMATIKA UIN Jakarta.' },
                { title: 'Fokus Kontribusi', text: 'Mendukung pelaksanaan program kerja departemen dan kegiatan organisasi. Rincian tugas dapat ditambahkan sesuai program kerja yang dijalankan.' }
            ],
            tools: ['Organizational Work', 'Team Collaboration', 'Communication'],
            links: []
        },
        rasio: {
            type: 'ORGANIZATIONAL EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · 2025–2026',
            title: 'Staff Departemen RASIO',
            summary: 'Berperan sebagai PIC HIMATIKA Esports serta mendukung koordinasi pelaksanaan kegiatan esports.',
            sections: [
                { title: 'Tanggung Jawab', text: 'Menjadi Penanggung Jawab (PIC) HIMATIKA Esports dan mengoordinasikan dukungan pelaksanaan program serta kegiatan esports HIMATIKA.' }
            ],
            tools: ['Coordination', 'Teamwork', 'Event Operations'],
            links: []
        },
        himeng5: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA',
            title: 'Ketua Pelaksana — HIMATIKA Mengajar Gen 5',
            summary: 'Memimpin perencanaan dan pelaksanaan program HIMATIKA Mengajar Gen 5 serta mengoordinasikan panitia dan pihak terkait.',
            gallery: [
                { src: 'assets/images/experience/himeng-gen5/himeng5-01.jpg', width: 1536, height: 1024, alt: 'Dokumentasi HIMATIKA Mengajar Gen 5', caption: 'Dokumentasi kegiatan' },
                { src: 'assets/images/experience/himeng-gen5/himeng5-02.jpg', width: 1536, height: 1024, alt: 'Kebersamaan tim HIMATIKA Mengajar Gen 5', caption: 'Kebersamaan tim' },
                { src: 'assets/images/experience/himeng-gen5/himeng5-03.jpg', width: 1536, height: 1024, alt: 'Sambutan Ketua Pelaksana', caption: 'Sambutan Ketua Pelaksana' },
                { src: 'assets/images/experience/himeng-gen5/himeng5-04.jpg', width: 1536, height: 1024, alt: 'Penyerahan sertifikat kepada pihak sekolah', caption: 'Penyerahan sertifikat' },
                { src: 'assets/images/experience/himeng-gen5/himeng5-05.jpg', width: 1536, height: 1024, alt: 'Interaksi dan pendampingan peserta didik', caption: 'Interaksi dan pendampingan peserta didik' }
            ],
            sections: [
                { title: 'Kepemimpinan Program', text: 'Memimpin keseluruhan proses perencanaan dan pelaksanaan program serta mengoordinasikan divisi dan anggota kepanitiaan.' },
                { title: 'Koordinasi', text: 'Memantau jalannya kegiatan dan memastikan kebutuhan setiap divisi dapat terpenuhi.' }
            ],
            tools: ['Leadership', 'Program Management', 'Team Coordination'],
            links: []
        },
        musyaka: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · FEBRUARI–APRIL 2026',
            title: 'Ketua Pelaksana — MUSYAKA 2026',
            summary: 'Memimpin proses perencanaan dan pelaksanaan MUSYAKA 2026 serta mengoordinasikan divisi, panitia, dan kebutuhan operasional kegiatan.',
            gallery: [
                { src: 'assets/images/experience/musyaka/musyaka-01.jpg', width: 1536, height: 1024, alt: 'Dokumentasi kegiatan MUSYAKA', caption: 'Dokumentasi kegiatan MUSYAKA' },
                { src: 'assets/images/experience/musyaka/musyaka-02.jpg', width: 1536, height: 1024, alt: 'Sambutan Ketua Pelaksana', caption: 'Sambutan Ketua Pelaksana' },
                { src: 'assets/images/experience/musyaka/musyaka-03.jpg', width: 1536, height: 1152, alt: 'Dokumentasi tambahan MUSYAKA 2026', caption: 'Dokumentasi MUSYAKA 2026' }
            ],
            sections: [
                { title: 'Kepemimpinan', text: 'Memimpin keseluruhan proses perencanaan dan pelaksanaan kegiatan serta mengoordinasikan divisi dan anggota kepanitiaan.' },
                { title: 'Pengelolaan Kegiatan', text: 'Memantau pelaksanaan kegiatan dan memastikan kebutuhan operasional setiap divisi terpenuhi.' }
            ],
            tools: ['Leadership', 'Event Management', 'Coordination'],
            links: []
        },
        teorema15: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · AGUSTUS–NOVEMBER 2026',
            title: 'Kepala Divisi Lapangan — Teorema 15',
            summary: 'Mengoordinasikan operasional lapangan, logistik, personel, serta kebutuhan lokasi dan akomodasi kegiatan.',
            gallery: [
                { src: 'assets/images/experience/teorema15/teorema15-01.jpg', width: 1536, height: 1024, alt: 'Dokumentasi peserta dan panitia Teorema 15', caption: 'Dokumentasi peserta dan panitia' },
                { src: 'assets/images/experience/teorema15/teorema15-02.jpg', width: 1536, height: 864, alt: 'Dokumentasi peserta, panitia, serta tamu undangan', caption: 'Dokumentasi peserta, panitia, serta tamu undangan' },
                { src: 'assets/images/experience/teorema15/teorema15-03.jpg', width: 1536, height: 1024, alt: 'Dokumentasi tim Teorema 15', caption: 'Kebersamaan tim' }
            ],
            sections: [
                { title: 'Tanggung Jawab', text: 'Mengoordinasikan operasional lapangan dan kebutuhan logistik, mencari serta mengatur lokasi kegiatan dan akomodasi peserta, serta menyusun pembagian kamar dan tata letak akomodasi.' }
            ],
            tools: ['Field Operations', 'Logistics', 'Accommodation Planning', 'Coordination'],
            links: []
        },
        teorema14: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · AGUSTUS–NOVEMBER 2025',
            title: 'Kepala Divisi Lapangan — Teorema 14',
            summary: 'Mengoordinasikan operasional lapangan dan anggota divisi serta membantu pengaturan lokasi dan akomodasi peserta.',
            sections: [
                { title: 'Tanggung Jawab', text: 'Mengoordinasikan operasional lapangan dan anggota divisi lapangan, serta mengatur kebutuhan lokasi kegiatan dan akomodasi peserta.' }
            ],
            tools: ['Field Operations', 'Team Coordination', 'Logistics'],
            links: []
        },
        pbak: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · 2025',
            title: 'Kepala Divisi Logistik — PBAK Jurusan Matematika 2025',
            summary: 'Bertanggung jawab atas pengelolaan kebutuhan logistik dan pendistribusian perlengkapan operasional kegiatan.',
            gallery: [
                { src: 'assets/images/experience/pbak-2025/pbak-01.jpg', width: 1536, height: 1024, alt: 'Foto bersama peserta dan panitia PBAK', caption: 'Foto bersama peserta dan panitia PBAK' },
                { src: 'assets/images/experience/pbak-2025/pbak-02.jpg', width: 1536, height: 1153, alt: 'Koordinasi kegiatan PBAK', caption: 'Koordinasi kegiatan PBAK' },
                { src: 'assets/images/experience/pbak-2025/pbak-03.jpg', width: 1536, height: 864, alt: 'Dokumentasi kegiatan PBAK', caption: 'Dokumentasi kegiatan PBAK' }
            ],
            sections: [
                { title: 'Tanggung Jawab', text: 'Mengelola kebutuhan logistik kegiatan, mengatur persediaan perlengkapan operasional, dan mendukung pendistribusian perlengkapan agar kebutuhan kegiatan terpenuhi.' }
            ],
            tools: ['Logistics Management', 'Inventory', 'Event Operations'],
            links: []
        },
        himeng4: {
            type: 'COMMITTEE EXPERIENCE',
            category: 'HIMATIKA UIN JAKARTA · 2025',
            title: 'Staff Hubungan Masyarakat — HIMATIKA Mengajar Gen 4',
            summary: 'Mendukung komunikasi dan hubungan dengan peserta serta pihak-pihak terkait selama pelaksanaan HIMATIKA Mengajar Gen 4.',
            gallery: [
                { src: 'assets/images/experience/himeng-gen4/himeng4-01.jpg', width: 1536, height: 864, alt: 'Dokumentasi MC Himatika Mengajar Gen 4', caption: 'Dokumentasi MC Himatika Mengajar Gen 4' },
                { src: 'assets/images/experience/himeng-gen4/himeng4-02.jpg', width: 1152, height: 1536, alt: 'Foto bersama tim pelaksana', caption: 'Foto bersama tim pelaksana' },
                { src: 'assets/images/experience/himeng-gen4/himeng4-03.jpg', width: 1536, height: 864, alt: 'Dokumentasi kegiatan bersama peserta didik', caption: 'Dokumentasi kegiatan bersama peserta didik' },
                { src: 'assets/images/experience/himeng-gen4/himeng4-04.jpg', width: 1536, height: 1023, alt: 'Foto bersama peserta kegiatan', caption: 'Foto bersama peserta kegiatan' }
            ],
            sections: [
                { title: 'Tanggung Jawab', text: 'Membantu komunikasi dan penyampaian informasi kepada peserta serta pihak terkait, sekaligus mendukung koordinasi hubungan masyarakat untuk kelancaran kegiatan.' }
            ],
            tools: ['Public Relations', 'Communication', 'Stakeholder Coordination'],
            links: []
        }
    };

    let lastProjectTrigger = null;
    let modalPreviousOverflow = '';
    const setModalBackgroundInert = (isInert) => {
        const mainRegion = document.querySelector('main');
        backgroundRegions.forEach((region) => {
            if (region === mainRegion) {
                Array.from(region.children).forEach((child) => {
                    if (child !== projectModal) child.inert = isInert;
                });
            } else {
                region.inert = isInert;
            }
        });
    };

    const openProjectModal = (projectId, trigger) => {
        if (!projectModal || !projectModalTitle || !projectModalBody) return;

        const project = projectDetails[projectId];
        if (!project) return;

        lastProjectTrigger = trigger;

        projectModalTitle.textContent = project.title;
        const modalKicker = document.getElementById('project-modal-kicker');
        if (modalKicker) modalKicker.textContent = project.type || 'PROJECT DETAIL';
        const galleryHeading = project.type ? 'Experience Gallery' : 'Project Gallery';

        projectModalBody.innerHTML = `
            <p class="project-modal-category">${project.category}</p>
            <p class="project-modal-summary">${project.summary}</p>

            ${project.gallery?.length ? `
                <section class="project-modal-gallery" aria-label="Galeri dokumentasi">
                    <div class="project-modal-gallery-heading">
                        <h3>${galleryHeading}</h3>
                        <span>${project.gallery.length} visual</span>
                    </div>
                    <div class="project-gallery-grid">
                        ${project.gallery.map((item, index) => `
                            <button type="button"
                                    class="project-gallery-trigger"
                                    data-gallery-index="${index}"
                                    aria-label="Perbesar gambar: ${item.alt}">
                                <picture>
                                    ${item.webpSrcset
                                        ? `<source type="image/webp" srcset="${item.webpSrcset}" sizes="${item.webpSizes}">`
                                        : item.webpSrc
                                            ? `<source type="image/webp" srcset="${item.webpSrc}">`
                                            : ''}
                                    <img src="${item.src}"
                                         alt="${item.alt}"
                                         width="${item.width}"
                                         height="${item.height}"
                                         data-full-src="${item.src}"
                                         loading="lazy"
                                         decoding="async">
                                </picture>
                                <span class="project-gallery-caption">${item.caption}</span>
                                <span class="project-gallery-zoom" aria-hidden="true">⤢</span>
                            </button>
                        `).join('')}
                    </div>
                </section>
            ` : ''}

            ${project.stats?.length ? `
            <div class="project-modal-stats">
                ${project.stats.map(([value, label]) => `
                    <div class="project-modal-stat">
                        <strong>${value}</strong>
                        <span>${label}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <div class="project-modal-sections">
                ${project.sections.map(section => `
                    <section class="project-modal-section">
                        <h3>${section.title}</h3>
                        <p>${section.text}</p>
                    </section>
                `).join('')}
            </div>

            <div class="project-modal-tools">
                <h3>${project.type ? "Key Competencies" : "Tools & Technologies"}</h3>
                <div class="project-modal-tags">
                    ${project.tools.map(tool => `<span class="exp-tag">${tool}</span>`).join('')}
                </div>
            </div>

            ${project.links?.length ? `
            <div class="project-modal-actions">
                ${project.links.map(([label, url]) => `
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="project-modal-link">
                        ${label} <span aria-hidden="true">↗</span>
                    </a>
                `).join('')}
            </div>
            ` : ''}
        `;

        modalPreviousOverflow = document.body.style.overflow;
        setModalBackgroundInert(true);
        projectModal.hidden = false;
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        projectModalClose?.focus();
    };

    const closeProjectModal = () => {
        if (!projectModal || projectModal.hidden) return;

        projectModal.hidden = true;
        projectModal.setAttribute('aria-hidden', 'true');
        setModalBackgroundInert(false);
        document.body.style.overflow = modalPreviousOverflow;

        lastProjectTrigger?.focus();
        lastProjectTrigger = null;
    };

    // Lightweight image lightbox for project gallery visuals.
    let activeGalleryTrigger = null;
    const imageLightbox = document.createElement('div');
    imageLightbox.className = 'project-image-lightbox';
    imageLightbox.hidden = true;
    imageLightbox.setAttribute('role', 'dialog');
    imageLightbox.setAttribute('aria-modal', 'true');
    imageLightbox.setAttribute('aria-label', 'Pratinjau gambar proyek');
    imageLightbox.innerHTML = `
        <button type="button" class="project-image-lightbox-close" aria-label="Tutup gambar">&times;</button>
        <figure class="project-image-lightbox-figure">
            <img class="project-image-lightbox-img" src="" alt="">
            <figcaption class="project-image-lightbox-caption"></figcaption>
        </figure>
    `;
    document.body.appendChild(imageLightbox);

    const closeImageLightbox = () => {
        if (imageLightbox.hidden) return;
        imageLightbox.hidden = true;
        imageLightbox.querySelector('.project-image-lightbox-img').src = '';
        if (projectModal && !projectModal.hidden) {
            projectModal.inert = false;
            projectModal.setAttribute('aria-hidden', 'false');
        }
        activeGalleryTrigger?.focus();
        activeGalleryTrigger = null;
    };

    const openImageLightbox = (trigger) => {
        const image = trigger.querySelector('img');
        if (!image) return;
        activeGalleryTrigger = trigger;
        const lightboxImage = imageLightbox.querySelector('.project-image-lightbox-img');
        lightboxImage.src = image.dataset.fullSrc || image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        imageLightbox.querySelector('.project-image-lightbox-caption').textContent =
            trigger.querySelector('.project-gallery-caption')?.textContent || image.alt;
        if (projectModal && !projectModal.hidden) {
            projectModal.inert = true;
            projectModal.setAttribute('aria-hidden', 'true');
        }
        imageLightbox.hidden = false;
        imageLightbox.querySelector('.project-image-lightbox-close').focus();
    };

    // Event delegation supports all project buttons and gallery images.
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        const galleryTrigger = target.closest('.project-gallery-trigger');
        if (galleryTrigger) {
            openImageLightbox(galleryTrigger);
            return;
        }

        if (target.closest('.project-image-lightbox-close') || target === imageLightbox) {
            closeImageLightbox();
            return;
        }

        const trigger = target.closest('[data-project]');
        if (trigger) {
            openProjectModal(trigger.getAttribute('data-project'), trigger);
            return;
        }

        if (target.closest('[data-modal-close]')) {
            closeProjectModal();
        }
    });

    // Close the image preview first; otherwise close the project modal.
    document.addEventListener('keydown', (event) => {
        if (!imageLightbox.hidden) {
            if (event.key === 'Escape') closeImageLightbox();
            else keepFocusInside(event, imageLightbox);
        } else if (projectModal && !projectModal.hidden) {
            if (event.key === 'Escape') closeProjectModal();
            else keepFocusInside(event, projectModal.querySelector('.project-modal-dialog'));
        }
    });
    /* ----------------------------------------------------------------------
       6. CONSOLE SIGNATURE
       ---------------------------------------------------------------------- */
    console.log(
        '%c Muhammad Abid Wijiyanto %c Mathematics & Data Analytics Portfolio ',
        'background: #38bdf8; color: #07090e; font-weight: 800; padding: 4px 8px; border-radius: 4px 0 0 4px;',
        'background: #0d131f; color: #cbd5e1; font-weight: 500; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
});
