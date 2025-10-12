// ========================================
// CARREGAMENTO DE COMPONENTES
// ========================================

function loadComponent(elementId, filePath) {
    return fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            }
            
            if (elementId === 'header-placeholder') {
                initHeaderScripts();
            }
            
            if (elementId === 'modals-placeholder' && window.__i18nDict) {
                tApply(window.__i18nDict);
            }
        })
        .catch(error => console.error('Erro ao carregar:', error));
}

// ========================================
// INICIALIZAÇÃO DOS SCRIPTS DO HEADER
// ========================================

function initHeaderScripts() {
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('hidden');
            }
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    console.log('✅ Scripts do header inicializados');
}

// ========================================
// FUNÇÕES DOS MODAIS
// ========================================

function openBenefitsModal() {
    const modal = document.getElementById('benefitsModal');
    if (!modal) {
        console.warn('Aguardando modal carregar...');
        setTimeout(openBenefitsModal, 100);
        return;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeBenefitsModal() {
    const modal = document.getElementById('benefitsModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function openLocationsModal() {
    const modal = document.getElementById('locationsModal');
    if (!modal) {
        console.warn('Aguardando modal carregar...');
        setTimeout(openLocationsModal, 100);
        return;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLocationsModal() {
    const modal = document.getElementById('locationsModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// ========================================
// i18n - INTERNACIONALIZAÇÃO
// ========================================

// Helper para pegar tradução
function t(key) {
    const dict = window.__i18nDict;
    if (!dict) return key;
    const val = key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
    return (typeof val === 'string') ? val : key;
}

// Sistema de internacionalização
(function(){
    const DEFAULT_LANG = 'en';
    const LS_KEY = 'mylux_lang';

    async function loadLocale(lang) {
        const res = await fetch(`locales/${lang}.json?v=1`, {cache: 'no-store'});
        if (!res.ok) throw new Error('Locale not found');
        return res.json();
    }

    // Tornar tApply global para ser acessível
    window.tApply = function tApply(dict) {
        // texto interno
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = key.split('.').reduce((o,k)=> (o||{})[k], dict);
            if (typeof val === 'string') el.innerHTML = val;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
            const key = el.getAttribute('data-i18n-placeholder');
            const val = key.split('.').reduce((o,k)=> (o||{})[k], dict);
            if (typeof val === 'string') el.setAttribute('placeholder', val);
        });
        document.documentElement.setAttribute('lang', dict.__meta?.lang || 'en');
    };

    async function setLang(lang) {
        try {
            const dict = await loadLocale(lang);
            window.__i18nDict = dict;
            window.tApply(dict);
            localStorage.setItem(LS_KEY, lang);
            
            // Feedback visual no switcher
            document.querySelectorAll('#langSwitcher [data-lang], #mobileLangSwitcher [data-lang]').forEach(b=>{
                b.classList.toggle('ring-2', b.dataset.lang===lang);
                b.classList.toggle('ring-white/70', b.dataset.lang===lang);
            });
        } catch(e) {
            console.warn('i18n load failed:', e);
        }
    }

    window.setLang = setLang;

    // Inicialização do i18n
    (function initI18n(){
        const saved = localStorage.getItem(LS_KEY);
        const browser = (navigator.language||'en').slice(0,2).toLowerCase();
        const initial = saved || (['pt','en','es'].includes(browser) ? browser : DEFAULT_LANG);
        setLang(initial); // Usa o idioma salvo ou do navegador
    })();
})();

// Delegação de clique para language switcher
(function(){
    function closeMobileMenu(){
        const menu = document.getElementById('mobileMenu');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            document.documentElement.classList.remove('overflow-hidden');
        }
    }

    document.addEventListener('click', function(e){
        const btn = e.target.closest('#langSwitcher [data-lang], #mobileLangSwitcher [data-lang]');
        if (!btn) return;

        e.preventDefault();
        const lang = btn.dataset.lang;

        if (typeof window.setLang === 'function') {
            window.setLang(lang);
        }

        if (btn.closest('#mobileMenu')) closeMobileMenu();
    });
})();

// Função para detectar idioma atual
function getCurrentLanguage() {
    return window.__i18nDict?.__meta?.lang || 'pt';
}

// ========================================
// SPA - CONTROLE DE NAVEGAÇÃO
// ========================================

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

// ========================================
// INICIALIZAÇÃO PRINCIPAL
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Página carregada...');
    
    // 1. Carrega modais PRIMEIRO
    await loadComponent('modals-placeholder', 'modals.html');
    
    // 2. Carrega header e footer em paralelo
    await Promise.all([
        loadComponent('header-placeholder', 'header.html'),
        loadComponent('footer-placeholder', 'footer.html')
    ]);
    
    // 3. Event listeners dos modals
    const benefitsModal = document.getElementById('benefitsModal');
    if (benefitsModal) {
        benefitsModal.addEventListener('click', (e) => {
            if (e.target === benefitsModal) closeBenefitsModal();
        });
    }
    
    const locationsModal = document.getElementById('locationsModal');
    if (locationsModal) {
        locationsModal.addEventListener('click', (e) => {
            if (e.target === locationsModal) closeLocationsModal();
        });
    }
    
    // 4. ESC para fechar modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBenefitsModal();
            closeLocationsModal();
        }
    });
    
    // 5. Verifica se deve mostrar veículos (SPA)
    const shouldShowVehicles = localStorage.getItem('show-vehicles');
    const hash = window.location.hash;
    
    if (shouldShowVehicles === 'true' || hash === '#vehicles') {
        console.log('✅ Mostrando veículos (redirect detectado)');
        showVehicles();
        localStorage.removeItem('show-vehicles');
    }
    
    // 6. Monitorar mudanças de hash
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#vehicles') {
            showVehicles();
        } else if (window.location.hash === '' || window.location.hash === '#home') {
            backToSearch();
        }
    });
    
    console.log('✅ Sistema AllyCars inicializado!');
});
