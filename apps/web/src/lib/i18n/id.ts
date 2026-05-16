/*
 * Indonesian dictionary. Typed against typeof en.dict so any missing or
 * misnamed key fails the build. Some technical terms (CI/CD, on-call,
 * SLA, RAG, agent, eval, framework names) intentionally retain English
 * forms — these are loanwords in the Indonesian tech industry.
 *
 * Marketing copy was translated to be natural, not literal. Native-speaker
 * pass recommended before launch — entries that I'm less certain about
 * carry a `// review` comment so they're easy to find.
 */

import type { dict as en } from './en';

export const dict: typeof en = {
  meta: {
    siteName: 'Zalvice',
    defaultDescription:
      'Dari rancangan ke produksi — desain, pengembangan, infrastruktur, dukungan, dan konsultasi. Satu tim terintegrasi yang telah membantu 100+ perusahaan mengubah cara mereka beroperasi.',
    siteSwitchLabel: 'Ganti bahasa situs',
  },

  nav: {
    primaryLabel: 'Utama',
    services: 'Layanan',
    work: 'Proyek',
    blog: 'Blog',
    about: 'Tentang Kami',
    contact: 'Kontak',
    startProject: 'Mulai proyek',
    start: 'Mulai',
    home: 'Beranda Zalvice',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    siteNav: 'Navigasi situs',
    tagline: 'Mitra rekayasa end-to-end Anda',
    readyToStart: 'Siap mulai?',
  },

  footer: {
    services: 'Layanan',
    company: 'Perusahaan',
    getInTouch: 'Hubungi kami',
    location: 'Jakarta · Remote-first',
    privacy: 'Privasi',
    terms: 'Ketentuan',
    sitemap: 'Peta situs',
    rss: 'RSS',
    description:
      'Dari rancangan ke produksi — kami merekayasa sistem yang diandalkan perusahaan. Desain, pengembangan, infrastruktur, dukungan, dan konsultasi dalam satu atap.',
    copyright: '© {year} Zalvice. Hak cipta dilindungi.',
  },

  masthead: {
    eyebrustedBy: 'Dipercaya oleh {value}{suffix} perusahaan',
    eyebrustedByFallback: 'Dipercaya perusahaan di seluruh dunia',
    subhead:
      'Desain, pengembangan, infrastruktur, dan dukungan berkelanjutan — satu tim terintegrasi yang telah membantu mengubah cara perusahaan beroperasi.',
    seeWork: 'Lihat proyek kami',
    variants: [
      {
        emphasis: 'Dari rancangan ke produksi',
        rest: ' — kami merekayasa sistem yang diandalkan perusahaan.',
      },
      {
        emphasis: 'Desain, bangun, operasikan.',
        rest: ' Satu tim terintegrasi yang menangani pekerjaan dari awal hingga akhir.',
      },
      {
        emphasis: 'Engineer senior, sejak hari pertama.',
        rest: ' Tanpa bait-and-switch, tanpa offshore handoff.',
      },
      {
        emphasis: 'Tools yang sudah terbukti, digunakan dengan baik.',
        rest: ' Sistem yang dibangun untuk bertahan lama setelah peluncuran.',
      },
      {
        emphasis: 'Pengembangan AI-native.',
        rest: ' Dari RAG dan agent hingga eval — siap produksi, bukan demo.',
      },
    ],
  },

  process: {
    eyebrow: 'Cara kami bekerja',
    headlineEmph: 'Discover. Design. Build. Operate.',
    intro:
      'Satu tim terintegrasi membawa pekerjaan dari kickoff hingga operasi live — tanpa handoff, tanpa rework antar vendor.',
    stepLabel: 'Langkah',
    steps: [
      {
        label: 'Discover',
        body: 'Kami memetakan sistem secara menyeluruh sebelum menulis satu baris kode pun — pengguna, kendala, infra, metrik keberhasilan.',
        duration: '1–2 minggu',
      },
      {
        label: 'Design',
        body: 'Arsitektur informasi, pola interaksi, dan design system yang bisa langsung dipakai engineering untuk shipping.',
        duration: '2–4 minggu',
      },
      {
        label: 'Build',
        body: 'Loop feedback yang ketat dengan tim yang akan memiliki sistem ini. CI sejak hari pertama, tanpa rilis big-bang.',
        duration: '6–16 minggu',
      },
      {
        label: 'Operate',
        body: 'Setelah live, kami tetap siaga — monitoring, on-call, kapasitas, respons insiden.',
        duration: 'Berkelanjutan',
      },
    ],
  },

  services: {
    eyebrow: 'Apa yang kami kerjakan',
    headlineEmph: 'Lima pilar, satu tim terintegrasi.',
    intro:
      'Kami menghadirkan desain, pengembangan, infrastruktur, dukungan, dan konsultasi bersama — bukan lima penawaran terpisah. Satu tim, satu standar, dari awal hingga akhir.',
    learnMore: 'Selengkapnya',
    swipeHint: 'Geser untuk lihat lainnya →',
  },

  stats: {
    eyebrow: 'Dalam angka',
    headline: 'Bukti, dalam produksi.',
    note: 'Angka diambil langsung dari back office — selalu terkini, tidak diperkirakan.',
  },

  articles: {
    eyebrow: 'Tulisan terbaru',
    headlineEmph: 'Catatan dari lantai build.',
    intro:
      'Catatan engineering, infrastruktur, dan operasi dari proyek yang telah kami kerjakan — dikelola di back office, dipublikasi dalam hitungan menit.',
    managedIn: 'Dikelola di /admin',
    allArticles: 'Semua tulisan',
    readTimeUnit: 'menit',
  },

  techStack: {
    eyebrow: 'Teknologi',
    headlineEmph: 'End-to-end, dengan AI sebagai dasar.',
    intro:
      'Kami menggunakan toolchain yang sama di setiap engagement agar pekerjaan bisa dipindahkan dan model operasinya dapat diprediksi. AI adalah lapisan utama, bukan tambahan.',
    deliveryTitle: 'Stack pengembangan kami',
    deliveryNote: 'Apa yang kami pakai untuk membangun',
    aiTitle: 'Kemampuan AI yang kami bangun untuk Anda',
    aiNote: 'Siap produksi, bukan demoware',
    approach:
      'Pendekatan: kami menjalankan pilot pada model kelas Claude atau GPT-4 dulu, melengkapi dengan eval sejak hari pertama, dan tetap membuka opsi untuk berganti penyedia. Tidak ada vendor lock-in di luar yang dibutuhkan produk.',
  },

  finalCta: {
    eyebrow: 'Punya sistem yang ingin dibangun?',
    headline: 'Bicara dengan tim yang akan benar-benar mengerjakannya.',
    intro:
      'Tanpa SDR funnel, tanpa proses procurement empat minggu. Anda akan berbicara langsung dengan engineer atau designer yang bisa jadi bagian dari proyek Anda.',
    bookCall: 'Pesan sesi 30 menit',
    reassurance: [
      'Balasan dalam 1 hari kerja',
      'NDA tersedia jika diperlukan',
      'Discovery dipimpin engineering, bukan sales',
    ],
  },

  lifecycle: {
    chip: 'live · 99.99% uptime',
    section: 'Siklus',
    headline: 'Dari rancangan ke produksi, dalam satu tim',
    footnote: 'Satu tim, dari awal hingga akhir',
    cta: 'Cara kami menghadirkan →',
  },

  logoStrip: {
    label: 'Dipercaya oleh perusahaan-perusahaan ini',
  },

  testimonials: {
    eyebrow: 'Yang dikatakan klien',
    headlineEmph: 'Ulasan dari tim yang sistemnya kami bangun.',
    intro:
      'Kutipan langsung dari orang-orang yang memiliki sistem yang kami kerjakan. Setiap ulasan menautkan ke studi kasusnya.',
    readCase: 'Baca studi kasus',
    aboutEyebrow: 'Ulasan',
    aboutHeadlineEmph: 'Menurut mereka.',
  },

  clientsWall: {
    eyebrow: 'Klien',
    headlineEmph: 'Perusahaan-perusahaan yang bekerja sama dengan kami.',
    intro:
      'Sebagian dari {count}+ tim yang mempercayakan pembangunan sistem yang mereka andalkan kepada kami.',
  },

  about: {
    title: 'Tentang Kami — Zalvice',
    description:
      'Tim engineering senior, remote-first, yang membangun sistem yang diandalkan perusahaan. Empat pilar pekerjaan — desain, engineering, infrastruktur, operasi — dalam satu atap.',
    eyebrow: 'Tentang Zalvice',
    headlineEmph: 'Tim senior yang ringkas',
    headlineRest: ' yang membangun sistem yang menjadi tumpuan bisnis Anda.',
    intro:
      'Kami adalah tim desain, engineering, dan operasi yang terintegrasi. Tanpa outsourcing, tanpa offshore handoff, tanpa junior bait-and-switch. Setiap engineer kami telah merilis ke produksi setidaknya lima tahun.',
    founded: 'Berdiri',
    clients: 'Klien',
    teamLabel: 'Tim',
    avgTenure: 'Rata-rata pengalaman',
    storyEyebrow: 'Cerita kami',
    storyHeadlineEmph: 'Dari praktik engineering, bukan dari sales pipeline.',
    storyParagraphs: [
      'Zalvice dimulai karena terlalu banyak perusahaan mendapatkan "delivery team" yang nyatanya tidak bisa delivering — pitch panjang, staf junior, proyek yang justru memperburuk keadaan.',
      'Kami membangun bentuk yang berbeda: tim senior yang ringkas, yang menangani pekerjaan dari awal hingga akhir. Desain, engineering, infrastruktur, dan operasi duduk di ruangan yang sama (mostly virtual, kadang fisik) dan shipping bersama.',
      'Saat ini kami bekerja sama dengan perusahaan pada sistem yang tidak boleh salah — billing, rekam medis, logistik, knowledge base berbasis AI. Kami tetap di posisi setelah peluncuran karena sistem tersebut sudah menjadi bagian dari cara bisnis berjalan.',
    ],
    valuesEyebrow: 'Cara kami bekerja',
    valuesHeadlineEmph: 'Empat prinsip, bukan poster values.',
    values: [
      {
        label: 'Reliabilitas di atas kebaruan',
        body: 'Kami memilih tools yang sudah terbukti dan bertahan lama. Bisnis Anda bergantung pada sistem ini jauh setelah peluncuran.',
      },
      {
        label: 'Rigor engineering',
        body: 'Spec, test, observability, runbook. Pekerjaan tidak glamor yang mencegah insiden jam 3 pagi.',
      },
      {
        label: 'Bench senior',
        body: 'Setiap engineer membawa pengalaman 5+ tahun dari industri tempat kami bekerja. Tidak ada bait-and-switch staffing.',
      },
      {
        label: 'Remote-first, sadar zona waktu',
        body: 'Async sebagai default. Sinkronus bila perlu. Kami mengikuti pekerjaan, bukan kalender.',
      },
    ],
    teamEyebrow: 'Tim kami',
    teamHeadlineEmph: 'Bench senior, di setiap posisi.',
    teamIntro:
      'Setiap engineer di bench memiliki pengalaman 5+ tahun di industri tempat kami bekerja. Tanpa junior bait-and-switch, tanpa offshore handoff.',
    filterLabel: 'Filter per tim',
    teamLabels: {
      eng: 'Engineering',
      design: 'Desain',
      infra: 'Infrastruktur',
      ops: 'Operasi',
    },
    yearsSuffix: '+ thn',
    ctaHeadline: 'Ingin bekerja sama dengan tim ini?',
    ctaBody:
      'Discovery call dilakukan dengan engineer atau designer — bukan salesperson. Kami akan menyampaikan dengan cepat apakah kami cocok untuk proyek Anda.',
  },

  contact: {
    title: 'Kontak — Zalvice',
    description:
      'Mulai proyek atau pesan discovery call 30 menit. Dibalas dalam satu hari kerja, oleh engineer atau designer — bukan salesperson.',
    eyebrow: 'Kontak',
    headlineEmph: 'Ceritakan sistem Anda kepada kami.',
    intro:
      'Isi form di bawah atau ambil slot 30 menit. Apa pun caranya, Anda akan terhubung dengan orang yang bisa jadi bagian dari proyek Anda — bukan SDR.',
    chips: ['Balasan dalam 1 hari kerja', 'NDA tersedia bila diperlukan', 'Tanpa SDR funnel'],
    formTitle: 'Mulai proyek',
    formIntro: 'Semua field bertanda * wajib diisi. Kami tidak akan membagikan data Anda — lihat',
    privacyPolicy: 'kebijakan privasi',
    labels: {
      name: 'Nama Anda',
      email: 'Email kantor',
      company: 'Perusahaan',
      projectType: 'Apa yang Anda butuhkan?',
      budget: 'Rentang budget',
      timeline: 'Timeline',
      message: 'Ceritakan apa yang ingin Anda bangun',
    },
    placeholders: {
      name: 'Andi Pratama',
      email: 'andi@perusahaan.com',
      company: 'PT Acme',
      message:
        'Sistem apa yang ingin Anda bangun atau operasikan? Adakah kendala, deadline, atau konteks yang perlu kami ketahui di awal?',
      chooseOne: 'Pilih satu…',
    },
    messageHint: 'Minimal 20 karakter.',
    turnstileNotice: 'Dilindungi oleh Cloudflare Turnstile. Dengan mengirim, Anda menyetujui',
    terms: 'ketentuan kami',
    send: 'Kirim',
    projectTypes: {
      design: 'Desain',
      development: 'Pengembangan',
      infrastructure: 'Infrastruktur',
      support: 'Dukungan',
      consulting: 'Konsultasi',
      other: 'Lainnya / belum yakin',
    },
    budgets: {
      under_25k: 'Di bawah $25k',
      '25k_75k': '$25k – $75k',
      '75k_200k': '$75k – $200k',
      '200k_plus': '$200k+',
      not_sure: 'Belum yakin',
    },
    timelines: {
      asap: 'Secepatnya',
      '1_3_months': 'Dalam 1–3 bulan',
      '3_6_months': 'Dalam 3–6 bulan',
      exploring: 'Sedang menjajaki',
    },
    bookTitle: 'Pesan sesi 30 menit',
    bookBody: 'Pilih slot langsung di kalender tim. Tanpa form follow-up.',
    openCalendar: 'Buka kalender',
    emailTitle: 'Lebih suka email?',
    emailGeneral: '— umum',
    emailSales: '— proyek baru',
    officesEyebrow: 'Kantor',
    officesHeadlineEmph: 'Dua kantor, satu tim async-first.',
    hq: 'Kantor pusat',
    offices: [
      {
        city: 'Jakarta',
        country: 'Indonesia',
        address: 'Jl. Sudirman Kav. 45\nKuningan, Jakarta Selatan 12940',
        timezone: 'GMT+7 · WIB',
        primary: true,
      },
      {
        city: 'Singapore',
        country: 'Singapura',
        address: '6 Battery Road, Level 30\nSingapore 049909',
        timezone: 'GMT+8 · SGT',
        primary: false,
      },
      {
        city: 'Remote',
        country: 'Global',
        address: 'Async-first di 6 zona waktu',
        timezone: 'Mana saja',
        primary: false,
      },
    ],
  },

  workIndex: {
    title: 'Proyek — Zalvice',
    description:
      'Proyek pilihan di berbagai industri — logistik, kesehatan, fintech, SaaS, retail, dan sektor publik. Masing-masing adalah sistem yang kini dijalankan klien.',
    eyebrow: 'Proyek pilihan',
    headlineEmph: 'Sistem yang sudah di-ship, sistem yang masih berjalan.',
    intro:
      'Contoh pekerjaan kami di berbagai industri. Filter berdasarkan pilar layanan atau industri untuk menemukan sesuatu yang dekat dengan kebutuhan Anda.',
    serviceFilterLegend: 'Layanan',
    industryFilterLegend: 'Industri',
    all: 'Semua',
    projects: 'proyek',
    emptyMessage: 'Tidak ada proyek yang cocok dengan filter ini.',
    resetFilters: 'Reset filter',
  },

  workDetail: {
    backToWork: 'Kembali ke daftar proyek',
    client: 'Klien',
    year: 'Tahun',
    team: 'Tim',
    teamSuffix: 'bln',
    services: 'Layanan',
    outcomes: 'Hasil',
    techStack: 'Tech stack',
    moreWork: 'Proyek lainnya',
    allProjects: 'Semua proyek',
    readCase: 'Baca studi kasus',
    viewCase: 'Lihat studi kasus',
    similarHeadline: 'Punya kebutuhan serupa?',
    similarBody: 'Tim yang sama yang mengerjakan proyek ini siap untuk engagement baru.',
  },

  servicesPage: {
    title: 'Layanan — Zalvice',
    description:
      'Desain, pengembangan, infrastruktur, dukungan, dan konsultasi — dihadirkan bersama oleh satu tim terintegrasi. Tanpa handoff multi-vendor, tanpa junior bait-and-switch.',
    eyebrow: 'Layanan',
    headlineEmph: 'Lima pilar,',
    headlineRest: ' satu tim terintegrasi yang menangani pekerjaan dari awal hingga akhir.',
    intro:
      'Kebanyakan agensi menjual salah satu dari ini. Kami menjual semuanya bersama — karena begitulah cara sistem benar-benar dibangun, di-ship, dan dioperasikan tanpa jatuh di celah antar vendor.',
    pillarsNavLabel: 'Pilar layanan',
    pillarPrefix: 'Pilar',
    whatYouGet: 'Apa yang Anda dapatkan',
    engagementModel: 'Model engagement',
    selectedCases: 'Studi kasus pilihan',
    talkAbout: 'Bicarakan dengan kami tentang',
    readCase: 'Baca studi kasus',
    integratedEyebrow: 'Mengapa ini penting',
    integratedHeadline:
      'Dibeli terpisah, ini lima vendor. Dibeli bersama, ini satu tim.',
    integratedBody:
      'Stack multi-vendor gagal di celah — desain handoff ke engineering, engineering handoff ke infra, infra handoff ke support, dan bug-nya hidup di celah-celah itu. Kami menghadirkan semua pilar bersama agar tidak ada handoff.',
    integratedBenefits: [
      'Satu hubungan komersial',
      'Satu rotasi on-call, satu channel Slack',
      'Roadmap bersama lintas desain, build, dan operasi',
      'Tidak ada saling menyalahkan ketika ada masalah',
    ],
    faqEyebrow: 'FAQ',
    faqHeadlineEmph: 'Pertanyaan yang biasa dihindari tim sales.',
    faqIntro: 'Jawaban lugas — sama dengan yang akan Anda dapatkan di discovery call.',
    ctaHeadline: 'Butuh satu pilar tertentu — atau kelimanya?',
    ctaBody:
      'Ceritakan apa yang Anda bangun. Dalam satu hari kerja kami akan menyampaikan apakah kami cocok, dan pilar mana yang sebaiknya dimulai.',

    overlay: {
      design: {
        longDescription:
          'Desain produk dan brand yang berakar pada cara sistem benar-benar berperilaku. Kami mendesain berdampingan dengan engineer yang membangunnya, bukan di studio tertutup yang menyerahkan file Figma.',
        whatYouGet: [
          'Desain produk end-to-end — IA, flow, screen, prototype',
          'Design system yang bisa dikembangkan tim Anda tanpa kami',
          'Identitas brand yang konsisten di produk, web, dan motion',
          'Riset dan usability testing dengan pengguna nyata',
          'Aksesibilitas dibangun sejak awal (WCAG 2.2 AA, bukan retrofit)',
          'Design token, komponen, dokumentasi',
        ],
        engagement: 'Discovery + design sprint dengan scope tetap, atau designer embedded dengan retainer.',
      },
      development: {
        longDescription:
          'Engineering web, mobile, dan backend yang dibangun untuk beroperasi bertahun-tahun. Tools yang sudah terbukti; CI sejak hari pertama; spec dan test sebagai default, bukan tambahan.',
        whatYouGet: [
          'Aplikasi web (Astro, Next.js, React)',
          'Aplikasi mobile (React Native, native Swift/Kotlin bila perlu)',
          'API dan service (Node, Go, Python)',
          'Data pipeline, ETL, surface analytics',
          'Fitur AI (RAG, agent, eval — lihat /work untuk contoh)',
          'Code review, kepemimpinan teknis, dan pairing untuk tim Anda',
        ],
        engagement: 'Build MVP dengan scope tetap, tim retainer, atau staff augmentation.',
      },
      infrastructure: {
        longDescription:
          'Cloud, CI/CD, dan platform engineering yang bisa diandalkan. Kami adalah tim yang sudah punya cerita on-call dari tiga industri — bukan tim yang belajar di tagihan Anda.',
        whatYouGet: [
          'Arsitektur cloud di AWS / GCP / Cloudflare',
          'Pipeline CI/CD, environment, otomasi deploy',
          'Infrastructure as code (Terraform, Pulumi)',
          'Observability — metric, trace, log, alert yang memanggil orang yang tepat',
          'Baseline keamanan — secret, IAM, audit trail, playbook insiden',
          'Review biaya; right-sizing tanpa mengorbankan reliabilitas',
        ],
        engagement: 'Proyek setup platform, lalu opsional retainer operasi berkelanjutan.',
      },
      support: {
        longDescription:
          'Setelah live, kami tetap siaga. Monitoring, on-call, perencanaan kapasitas, respons insiden, dan pekerjaan tidak glamor yang menjaga sistem tetap dapat diandalkan jauh setelah peluncuran.',
        whatYouGet: [
          'Operasi terkelola lintas web, mobile, dan infra',
          'Cakupan on-call 24/7 dengan SLA respons terdokumentasi',
          'Review ketahanan setiap kuartal — apa yang akan memanggil kami, apa yang sudah',
          'Runbook dan postmortem ditulis di awal, bukan setelah',
          'Forecasting kapasitas dan biaya',
          'Transfer pengetahuan ke tim Anda saat siap mengambil alih',
        ],
        engagement: 'Retainer bulanan, skala mengikuti kompleksitas sistem dan traffic.',
      },
      consulting: {
        longDescription:
          'Advisory senior ketika Anda butuh pendapat eksternal soal arsitektur, hiring, atau strategi teknis. Tanpa teater deliverable — hanya orang berpengalaman yang menyampaikan apa yang akan kami lakukan dan kenapa.',
        whatYouGet: [
          'Review arsitektur — pendapat kedua atas sistem yang sedang Anda bangun',
          'Tech due diligence — pra-akuisisi atau pra-investasi',
          'Strategi hiring — siapa yang harus di-hire berikutnya, apa yang sebaiknya di-outsource',
          'Scaling tim engineering — proses, ritual, on-call',
          'Pemilihan vendor dan platform (build vs buy, keputusan framework)',
          'Workshop — RAG, eval, sistem terdistribusi, design system',
        ],
        engagement: 'Tarif harian, retainer mingguan, atau review terbatas dengan deliverable tertulis.',
      },
    },

    faqs: [
      {
        q: 'Bagaimana cara Anda menentukan harga engagement?',
        a: 'Discovery dikenakan fee tetap agar Anda bisa membandingkan secara setara. Engagement build umumnya dengan scope tetap per fase dengan rate card transparan; retainer dihitung berdasarkan komposisi tim dan ekspektasi on-call.',
      },
      {
        q: 'Di mana tim berada?',
        a: 'Kantor pusat Jakarta + kantor Singapura, remote-first di enam zona waktu. Jam kerja kami ikuti engagement-nya, bukan sebaliknya.',
      },
      {
        q: 'Apakah Anda menandatangani NDA?',
        a: 'Ya — kami punya NDA mutual standar yang bisa ditandatangani dalam satu hari, atau kami bisa mereview NDA Anda.',
      },
      {
        q: 'Siapa yang memiliki IP?',
        a: 'Anda yang memilikinya. Setelah invoice diselesaikan, seluruh hasil kerja (kode, desain, infra, dokumentasi) berpindah kepada Anda. Kami hanya mempertahankan hak atas tooling dan template reusable yang kami bawa.',
      },
      {
        q: 'Seberapa kecil terlalu kecil?',
        a: 'Kami biasanya mulai dari sekitar $25k — di bawah itu biasanya lebih cocok untuk freelancer daripada tim. Gambaran besarnya: bila Anda tidak akan membawanya ke tim engineering internal untuk sprint 6 minggu, kemungkinan terlalu kecil.',
      },
      {
        q: 'Bagaimana penanganan dukungan berkelanjutan setelah build?',
        a: 'Sebagian besar engagement build langsung berlanjut ke retainer Support — tim yang mengerjakan tetap siaga dengan SLA respons terdokumentasi. Anda juga bisa keluar dan mengambil alih kapan pun.',
      },
      {
        q: 'Apakah Anda melayani fractional CTO?',
        a: 'Ya — lihat pilar Consulting. Tarif harian atau retainer mingguan dengan rekomendasi arsitektur / hiring / vendor secara tertulis.',
      },
      {
        q: 'Bulan pertama umumnya seperti apa?',
        a: 'Minggu 1: discovery — wawancara, audit sistem, metrik keberhasilan. Minggu 2: desain + technical spike secara paralel. Minggu 3: review akhir discovery dengan rencana dan estimasi terbatas. Minggu 4: kickoff bila kedua pihak sepakat untuk lanjut.',
      },
    ],
  },

  notFound: {
    title: '404 — Tidak ditemukan',
    headline: 'Halaman tidak ditemukan',
    body: 'Halaman yang Anda cari tidak ada.',
  },
};
