// ========================================
// CARREGAMENTO DE COMPONENTES (Header, Footer e Modals)
// ========================================

// Função para carregar componentes
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            // Re-inicializa scripts do header após carregar
            if (elementId === 'header-placeholder') {
                initHeaderScripts();
            }
            
            // Re-aplica traduções aos modais após carregar
            if (elementId === 'modals-placeholder' && window.__i18nDict) {
                tApply(window.__i18nDict);
            }
        })
        .catch(error => console.error('Erro ao carregar componente:', error));
}

// Carrega header, footer e modals quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');
    loadComponent('modals-placeholder', 'modals.html'); // ← NOVO
});

// Re-inicializa funcionalidades do header (menu mobile, etc)
function initHeaderScripts() {
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    // Language switcher
    initLanguageSwitcher();
}

const modal = document.getElementById('benefitsModal');

function openBenefitsModal() {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeBenefitsModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

// Também fecha ao clicar no backdrop
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeBenefitsModal();
  }
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeBenefitsModal();
  }
});

function i18nAlert(key, fallback) {
  try {
    const msg = (typeof t === 'function') ? t(key) : key;
    alert(msg && msg !== key ? msg : (fallback || key));
  } catch {
    alert(fallback || key);
  }
}

// ----- Controles do modal -----
const locationsModal = document.getElementById('locationsModal');

// ----- Estado global mínimo -----
window.__serviceMapInitialized = false;
window.__map = null;

// Util: garante que o DOM já existe
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

// Abre modal 
function openLocationsModal() {
  onReady(() => {
    const modal = document.getElementById('locationsModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
}

function closeLocationsModal() {
  const modal = document.getElementById('locationsModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

// Fecha clicando no backdrop
onReady(() => {
  const modal = document.getElementById('locationsModal');
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeLocationsModal();
  });
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('locationsModal');
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeLocationsModal();
  }
});


// helper para pegar tradução
function t(key) {
  const dict = window.__i18nDict;
  if (!dict) return key;
  const val = key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  return (typeof val === 'string') ? val : key;
}

  (function(){
    const DEFAULT_LANG = 'en';
    const LS_KEY = 'mylux_lang';

    async function loadLocale(lang) {
      const res = await fetch(`locales/${lang}.json?v=1`, {cache: 'no-store'});
      if (!res.ok) throw new Error('Locale not found');
      return res.json();
    }

    function tApply(dict) {
      // texto interno
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = key.split('.').reduce((o,k)=> (o||{})[k], dict);
        if (typeof val === 'string') el.innerHTML = val; // permite <strong> nos textos
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const key = el.getAttribute('data-i18n-placeholder');
        const val = key.split('.').reduce((o,k)=> (o||{})[k], dict);
        if (typeof val === 'string') el.setAttribute('placeholder', val);
      });
      document.documentElement.setAttribute('lang', dict.__meta?.lang || 'en');
    }

    async function setLang(lang) {
      try {
        const dict = await loadLocale(lang);
        window.__i18nDict = dict;
        tApply(dict);
        localStorage.setItem(LS_KEY, lang);
        // feedback visual no switcher
        document.querySelectorAll('#langSwitcher [data-lang]').forEach(b=>{
          b.classList.toggle('ring-2', b.dataset.lang===lang);
          b.classList.toggle('ring-white/70', b.dataset.lang===lang);
        });
      } catch(e) {
        console.warn('i18n load failed:', e);
      }
    }

    window.setLang = setLang; 

    // init
    (function initI18n(){
      const saved = localStorage.getItem(LS_KEY);
      const browser = (navigator.language||'en').slice(0,2).toLowerCase();
      const initial = saved || (['pt','en','es'].includes(browser) ? browser : DEFAULT_LANG);
      // setLang(initial);
      setLang('en');
      
      // clique nos botões
      document.querySelectorAll('#langSwitcher [data-lang]').forEach(btn=>{
        btn.addEventListener('click', ()=> setLang(btn.dataset.lang));
      });
    })();
  })();

  (function(){
    function closeMobileMenu(){
      const menu = document.getElementById('mobileMenu');
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        document.documentElement.classList.remove('overflow-hidden');
      }
    }

    // Delegação de clique: atende desktop e mobile
    document.addEventListener('click', function(e){
      const btn = e.target.closest('#langSwitcher [data-lang], #mobileLangSwitcher [data-lang]');
      if (!btn) return;

      e.preventDefault();
      const lang = btn.dataset.lang;

      if (typeof window.setLang === 'function') {
        window.setLang(lang);   // troca o idioma
      }

      if (btn.closest('#mobileMenu')) closeMobileMenu();
    });
  })();

// Função para detectar idioma atual
function getCurrentLanguage() {
  return window.__i18nDict?.__meta?.lang || 'pt';
}

// ===== CONTROLE DE NAVEGAÇÃO SPA - HQ RENTALCARS =====
let currentView = 'search';

function showVehicles() {
    console.log('🚗 Mostrando veículos disponíveis');
    
    const heroSection = document.getElementById('home');
    const vehiclesSection = document.getElementById('vehicles-section');
    const testimonialsSection = document.getElementById('testimonials-section');
    
    if (heroSection) heroSection.classList.add('hidden');
    if (vehiclesSection) {
        vehiclesSection.classList.remove('hidden');
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }
    if (testimonialsSection) testimonialsSection.classList.add('hidden');
    
    currentView = 'vehicles';
}

function backToSearch() {
    console.log('🔙 Voltando para busca');
    
    const heroSection = document.getElementById('home');
    const vehiclesSection = document.getElementById('vehicles-section');
    const testimonialsSection = document.getElementById('testimonials-section');
    
    if (heroSection) {
        heroSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (vehiclesSection) vehiclesSection.classList.add('hidden');
    if (testimonialsSection) testimonialsSection.classList.remove('hidden');
    
    // Limpar flags
    localStorage.removeItem('search-params');
    localStorage.removeItem('show-vehicles');
    window.history.pushState({}, '', 'index.html');
    
    currentView = 'search';
}

// Verificar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página carregada, verificando estado...');
    
    // Verifica se deve mostrar veículos (vindo do redirect)
    const shouldShowVehicles = localStorage.getItem('show-vehicles');
    const hash = window.location.hash;
    
    if (shouldShowVehicles === 'true' || hash === '#vehicles') {
        console.log('✅ Mostrando veículos (redirect detectado)');
        showVehicles();
        // Limpa a flag
        localStorage.removeItem('show-vehicles');
    }
    
    // Monitorar mudanças de hash
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#vehicles') {
            showVehicles();
        } else if (window.location.hash === '' || window.location.hash === '#home') {
            backToSearch();
        }
    });
});

console.log('✅ Sistema SPA AllyCars + HQ inicializado');
