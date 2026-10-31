// 1. MOBILE MENU TOGGLE
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const bar1 = document.getElementById('hamburger-bar-1');
const bar2 = document.getElementById('hamburger-bar-2');
const bar3 = document.getElementById('hamburger-bar-3');

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
  
  bar1.classList.toggle('rotate-45');
  bar1.classList.toggle('translate-x-[3px]');
  bar1.classList.toggle('translate-y-[2px]');
  
  bar2.classList.toggle('opacity-0');
  
  bar3.classList.toggle('-rotate-45');
  bar3.classList.toggle('translate-x-[3px]');
  bar3.classList.toggle('-translate-y-[2px]');
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.classList.contains('hidden') && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    bar1.classList.remove('rotate-45', 'translate-x-[3px]', 'translate-y-[2px]');
    bar2.classList.remove('opacity-0');
    bar3.classList.remove('-rotate-45', 'translate-x-[3px]', '-translate-y-[2px]');
  }
});

const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    bar1.classList.remove('rotate-45', 'translate-x-[3px]', 'translate-y-[2px]');
    bar2.classList.remove('opacity-0');
    bar3.classList.remove('-rotate-45', 'translate-x-[3px]', '-translate-y-[2px]');
  });
});

window.addEventListener('scroll', () => {
  const navContainer = document.getElementById('navbar-container');
  const nav = document.getElementById('navbar');
  if (window.scrollY > 80) {
    navContainer.classList.add('bg-navy-dark/85', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-mint/10');
    nav.classList.remove('py-6');
    nav.classList.add('py-4');
  } else {
    navContainer.classList.remove('bg-navy-dark/85', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-mint/10');
    nav.classList.remove('py-4');
    nav.classList.add('py-6');
  }
});

const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.6;
      this.alpha = Math.random() * 0.4 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 195, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 195, ${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', initParticles);
  initParticles();
  animateParticles();
}

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter-val');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress * (2 - progress);
          const currentVal = Math.floor(easeProgress * target);

          if (currentVal >= 1000) {
            counter.innerText = currentVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix;
          } else {
            counter.innerText = currentVal + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (target >= 1000) {
              counter.innerText = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix;
            } else {
              counter.innerText = target + suffix;
            }
          }
        }
        requestAnimationFrame(updateCounter);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const statsSection = document.getElementById('stats-section');
if (statsSection) statsObserver.observe(statsSection);

function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.before-after-container');
  
  containers.forEach(container => {
    const handle = container.querySelector('.drag-handle');
    const afterImage = container.querySelector('.after-image');
    let isDragging = false;

    function move(x) {
      const rect = container.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      
      handle.style.left = `${position}%`;
      afterImage.style.clipPath = `polygon(${position}% 0%, 100% 0%, 100% 100%, ${position}% 100%)`;
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      move(e.clientX);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      move(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}
initBeforeAfterSliders();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

let currentTestimonial = 0;
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.testimonial-dot');
const totalTestimonials = dots.length;
let testimonialInterval;

function showTestimonial(index) {
  currentTestimonial = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('bg-mint');
      dot.classList.remove('bg-pearl/30');
    } else {
      dot.classList.add('bg-pearl/30');
      dot.classList.remove('bg-mint');
    }
  });
}

function nextTestimonial() {
  let next = (currentTestimonial + 1) % totalTestimonials;
  showTestimonial(next);
}

function startCarousel() {
  testimonialInterval = setInterval(nextTestimonial, 4000);
}

function stopCarousel() {
  clearInterval(testimonialInterval);
}

const carouselContainer = document.querySelector('.testimonial-carousel-container');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', stopCarousel);
  carouselContainer.addEventListener('mouseleave', startCarousel);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showTestimonial(i);
  });
});

startCarousel();

const scrollTopBtn = document.getElementById('scroll-top-btn');
scrollTopBtn.classList.add('hidden');

window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    if (scrollTopBtn.classList.contains('hidden')) {
      scrollTopBtn.classList.remove('hidden');
      requestAnimationFrame(() => {
        scrollTopBtn.classList.remove('opacity-0', 'scale-90', 'translate-y-4');
        scrollTopBtn.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      });
    }
  } else {
    if (!scrollTopBtn.classList.contains('hidden')) {
      scrollTopBtn.classList.add('opacity-0', 'scale-90', 'translate-y-4');
      scrollTopBtn.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
      setTimeout(() => {
        if (window.scrollY <= 600) {
          scrollTopBtn.classList.add('hidden');
        }
      }, 300);
    }
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const servicesData = {
  blanchiment: {
    title: "Blanchiment Dentaire Signature",
    subtitle: "Un éclat irrésistible en toute sécurité",
    description: "Notre clinique utilise les technologies d'éclaircissement dentaire les plus avancées du marché, combinant l'application d'un gel d'éclaircissement breveté et une activation douce par lumière LED de haute intensité. Ce procédé permet de gagner plusieurs teintes de blanc en une seule séance de 60 minutes.",
    features: [
      "Traitement rapide en 1 heure au fauteuil",
      "Résultats visibles immédiatement",
      "Gel protecteur appliqué sur la gencive (sans sensibilité)",
      "Teinte finale ultra-naturelle harmonisée",
      "Kit de maintenance personnalisé offert pour la maison"
    ]
  },
  orthodontie: {
    title: "Orthodontie Moderne & Invisible",
    subtitle: "Alignez votre sourire en toute discrétion",
    description: "Dites adieu aux bagues métalliques traditionnelles. Grâce aux aligneurs transparents amovibles thermoformés sur mesure, nous corrigeons l'alignement de vos dents de manière quasiment invisible. Idéal pour les adultes et adolescents en quête de confort et de discrétion absolue.",
    features: [
      "Gouttières translucides amovibles pour manger librement",
      "Planification 3D complète visualisable avant le début",
      "Rendez-vous de suivi espacés toutes les 6 à 8 semaines",
      "Hygiène dentaire préservée au quotidien",
      "Résultats stables garantis avec fils de contention discrets"
    ]
  },
  implants: {
    title: "Implants Dentaires Premium",
    subtitle: "La solution définitive de restauration",
    description: "Remplacez une ou plusieurs dents manquantes avec des implants en titane biocompatible haut de gamme. Intégrés parfaitement à votre mâchoire, ils servent de racines artificielles robustes pour des couronnes en céramique de haute facture, recréant l'aspect et la force de vos dents naturelles.",
    features: [
      "Matériaux biocompatibles d'origine suisse",
      "Chirurgie assistée par ordinateur de haute précision",
      "Taux de réussite clinique supérieur à 98%",
      "Mastication confortable et élocution parfaitement naturelle",
      "Prévention de la perte osseuse de la mâchoire"
    ]
  },
  facettes: {
    title: "Facettes Dentaires en Céramique",
    subtitle: "Le secret des sourires parfaits",
    description: "Les facettes sont de fines pellicules de céramique pure collées sur la face externe de vos dents. Elles corrigent instantanément les défauts de structure, d'alignement léger, de coloration résistante, de forme ou les espaces entre les dents (diastèmes), pour un rendu spectaculaire.",
    features: [
      "Céramiques IPS e.max® hautement esthétiques",
      "Prise d'empreinte numérique 3D ultra-précise (sans pâte)",
      "Résistance exceptionnelle aux taches de café et thé",
      "Préservation maximale de la structure dentaire saine",
      "Sourire sur mesure adapté à la morphologie de votre visage"
    ]
  },
  gencives: {
    title: "Parodontologie & Soins des Gencives",
    subtitle: "Protégez les fondations de votre sourire",
    description: "Des gencives saines sont essentielles pour la pérennité de vos dents. Nous diagnostiquons et traitons les affections gingivales (gingivites, parodontites) grâce à des techniques modernes de surfaçage radiculaire aux ultra-sons et protocoles de désinfection laser indolores.",
    features: [
      "Bilan parodontal complet avec radiographie numérique",
      "Nettoyage en profondeur sous-gingival indolore",
      "Utilisation du laser médical pour éliminer les bactéries",
      "Stabilisation efficace du déchaussement des dents",
      "Protocole de maintenance personnalisé pour prévenir les récidives"
    ]
  },
  pediatrique: {
    title: "Soins Dentaires Pédiatriques",
    subtitle: "Accompagner les enfants avec douceur",
    description: "Nous croyons que les premières visites chez le dentiste déterminent la relation future avec la santé bucco-dentaire. Notre espace est chaleureusement pensé pour apaiser les enfants. Notre équipe emploie une approche pédagogique, rassurante et ludique pour chaque soin.",
    features: [
      "Approche psychologique douce sans douleur",
      "Sensibilisation ludique au brossage des dents",
      "Scellement des sillons protecteurs contre les caries",
      "Suivi précoce de la croissance des mâchoires (orthodontie préventive)",
      "Certificat de courage et cadeau offerts en fin de séance"
    ]
  }
};

const modal = document.getElementById('service-modal');
const modalContent = document.getElementById('modal-content');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalFeatures = document.getElementById('modal-features');
const closeModalBtn = document.getElementById('close-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalBookBtn = document.getElementById('modal-book-btn');
let selectedServiceKey = '';

function openServiceModal(key) {
  const data = servicesData[key];
  if (!data) return;
  selectedServiceKey = key;

  modalSubtitle.innerText = data.subtitle;
  modalTitle.innerText = data.title;
  modalDescription.innerText = data.description;
  
  modalFeatures.innerHTML = '';
  data.features.forEach(feat => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `<span class="text-mint font-bold">✓</span> <span>${feat}</span>`;
    modalFeatures.appendChild(li);
  });

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  }, 50);
}

function closeModal() {
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 200);
}

closeModalBtn.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

modalBookBtn.addEventListener('click', () => {
  closeModal();
  
  const selectService = document.getElementById('select-service');
  if (selectService) {
    selectService.value = selectedServiceKey;
    selectService.dispatchEvent(new Event('change'));
  }
  
  const formSection = document.getElementById('reservation');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
});

const form = document.getElementById('booking-form');
const bookingCard = document.getElementById('booking-card');
const bookingSuccess = document.getElementById('booking-success');
const resetBookingBtn = document.getElementById('reset-booking');

const selectElements = document.querySelectorAll('.floating-select');
selectElements.forEach(select => {
  select.addEventListener('change', () => {
    if (select.value !== "") {
      select.classList.add('has-value');
    } else {
      select.classList.remove('has-value');
    }
  });
});

const dateInput = document.getElementById('date-rdv');
dateInput.addEventListener('change', () => {
  if (dateInput.value !== "") {
    dateInput.classList.add('has-value');
  } else {
    dateInput.classList.remove('has-value');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  bookingCard.style.opacity = '0';
  bookingCard.style.transform = 'translateY(15px)';
  
  setTimeout(() => {
    form.classList.add('hidden');
    bookingSuccess.classList.remove('hidden');
    bookingSuccess.classList.add('flex');
    
    bookingCard.style.opacity = '1';
    bookingCard.style.transform = 'translateY(0)';
  }, 400);
});

resetBookingBtn.addEventListener('click', () => {
  bookingCard.style.opacity = '0';
  bookingCard.style.transform = 'translateY(15px)';

  setTimeout(() => {
    form.reset();
    selectElements.forEach(select => select.classList.remove('has-value'));
    dateInput.classList.remove('has-value');
    
    bookingSuccess.classList.add('hidden');
    bookingSuccess.classList.remove('flex');
    form.classList.remove('hidden');
    
    bookingCard.style.opacity = '1';
    bookingCard.style.transform = 'translateY(0)';
  }, 400);
});
