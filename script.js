
let CONFIG = {};
let configLoaded = false;

/* Função para carregar configurações do backend (NAO ESTA FUNCIONANDO !)
async function loadConfig() {
  try {
    console.log('🔄 Carregando configurações...');
    const response = await fetch('/.netlify/functions/config');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    CONFIG = await response.json();
    configLoaded = true;
    console.log('✅ Configurações carregadas com sucesso!');
    
    // Inicializar tudo após carregar config
    initializeApp();
    
  } catch (error) {
    console.error('❌ Erro ao carregar configurações:', error);
    alert('Erro ao carregar configurações do site. Recarregue a página.');
  }
}*/

async function loadConfig() {
  CONFIG = {
    SHEETS_ID: "1W1R2RXF7AgSrt6mYFgPiiFf0ZcuJVD7SIPze_ElMFOg",
    SHEETS_API_KEY: "AIzaSyABXr-VuUugRLw-SvIV0518LlDOcJNdgoA",
    EMAILJS_KEY: "nOAbxsrTxf7XxDJjo",
    SERVICE_ID: "service_zu5ldwk",
    ADMIN_TEMPLATE_ID: "0001",
    CLIENT_TEMPLATE_ID: "template_odf1st4",
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxuGKCTw3zEDcoSx7J170vtPsjxUn1iQgp6VwPKjN3WWW1vxsbLnn9tt8cnv6ZPFDwm/exec",
    GOOGLE_MAPS_API_KEY: "AIzaSyAiiaZvpFfHnXr7NNGb3Sa8YXzkaPnd4-Q"
  };
  
  configLoaded = true;
  console.log('Configurações carregadas');
  initializeApp();
}

// Função para inicializar a aplicação após carregar config
function initializeApp() {
    // Carregar Google Maps dinamicamente
  loadGoogleMaps();
}

// Função para carregar Google Maps
function loadGoogleMaps() {
  if (!CONFIG.GOOGLE_MAPS_API_KEY) {
    console.error('❌ Google Maps API key não encontrada');
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&language=pt-BR&region=US&callback=initPlacesAutocomplete`;
  script.async = true;
  script.defer = true;
  script.onerror = () => console.error('❌ Erro ao carregar Google Maps');
  document.head.appendChild(script);
  
  console.log('🗺️ Google Maps carregando...');
}

// Carregar config quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadConfig);
} else {
  loadConfig();
}

// Show payment modal
function showPaymentModal(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }

  const avail = document.getElementById('availabilityModal');
  const pay = document.getElementById('paymentModal');

  if (avail) {
    avail.classList.add('hidden');
    avail.style.display = '';
  }

  if (pay) {
    pay.classList.remove('hidden');
    pay.style.display = 'flex';
    pay.style.zIndex = 60;  // sobrepõe o availability
    pay.scrollTo(0, 0); 
  }

  document.body.style.overflow = 'hidden';
}

// Close payment modal
function closePaymentModal() {
  const pay = document.getElementById('paymentModal');
  if (pay) {
    pay.classList.add('hidden');
    pay.style.display = '';
  }

  // Se nenhum outro modal estiver aberto, libera o scroll do body
  const anyOpen = !document.getElementById('availabilityModal')?.classList.contains('hidden') ||
    !document.getElementById('confirmationModal')?.classList.contains('hidden');
  if (!anyOpen) document.body.style.overflow = '';
}

// Show confirmation
function showConfirmation() {
  const pay = document.getElementById('paymentModal');
  const conf = document.getElementById('confirmationModal');

  // Esconde Payment corretamente
  if (pay) {
    pay.classList.add('hidden');
    pay.style.display = '';   // <-- limpa o inline que podia mantê-lo visível
  }

  // Mostra Confirmation
  if (conf) {
    conf.classList.remove('hidden');
    conf.style.display = 'flex'; // garante layout flex
    conf.scrollTo(0, 0);
  }

  document.body.style.overflow = 'hidden';
}

function closeConfirmationModal() {
  const conf = document.getElementById('confirmationModal');
  if (conf) {
    conf.classList.add('hidden');
    conf.style.display = '';     // limpa inline
  }
  document.body.style.overflow = ''; // libera scroll do body
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

const fleetSwiper = new Swiper('.mylux-fleet', {
  speed: 500,
  spaceBetween: 24,
  loop: true,
  grabCursor: true,
  slidesPerView: 1,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '#fleetNext', prevEl: '#fleetPrev' },
  breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  preloadImages: false,
  lazy: { loadPrevNext: true, loadPrevNextAmount: 2 }
});

function formatDisplay(d) {
  if (!d) return "";
  if (typeof d === "string") {
    // já está no formato YYYY-MM-DD
    const m1 = d.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m1) return `${m1[1]}-${m1[2].padStart(2,"0")}-${m1[3].padStart(2,"0")}`;
    // veio como DD/MM/YYYY
    const m2 = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m2) return `${m2[3]}-${m2[2].padStart(2,"0")}-${m2[1].padStart(2,"0")}`;
  }
  // fallback: Date -> YYYY-MM-DD
  const dt = (d instanceof Date) ? d : new Date(d);
  if (isNaN(dt)) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// guarda preço diário do carro atual
let __currentDailyPrice = 0;

// Abre o modal lendo os data-* do botão clicado
function showAvailabilityModal(btnEl) {
  const pay = document.getElementById('paymentModal');
  if (pay) { pay.classList.add('hidden'); pay.style.display = ''; }

  // lê dataset do botão
  const model = btnEl.dataset.model || 'Selected Vehicle';
  const img = btnEl.dataset.img || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=70';
  const seats = btnEl.dataset.seats || '-';
  const lug = btnEl.dataset.luggage || '-';
  const price = Number(btnEl.dataset.price || 0);

  __currentDailyPrice = price;

  // Preenche elementos
  document.getElementById('modalCarTitle').textContent = `Check Availability — ${model}`;
  document.getElementById('selectedCarModel').textContent = model;
  document.getElementById('selectedCarImg').src = img;
  document.getElementById('selectedSeats').innerHTML = `<i class="fas fa-users mr-1"></i> ${seats} seats`;
  document.getElementById('selectedLuggage').innerHTML = `<i class="fas fa-suitcase mr-1"></i> ${lug} luggage`;

  // Limpa campos de datas e preço
  document.getElementById('pickupDate').value = '';
  document.getElementById('dropoffDate').value = '';
  document.getElementById('daysCount').textContent = '0';
  document.getElementById('calcSubtotal').textContent = '0';
  document.getElementById('calcTotal').textContent = '0';

  // Abre modal
  document.getElementById('availabilityModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';            // trava o fundo
  document.getElementById('availabilityModal')?.scrollTo(0, 0);     // garante topo do overlay
  document.getElementById('availabilityCard')?.scrollTo({ top: 0 }); // garante topo do card
  document.getElementById('availabilityCard')?.focus();              // acessibilidade

  // Inicializa (ou reinicializa) o calendário inline
  initInlineRangeCalendar();
}

function closeModal() {
  document.getElementById('availabilityModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Flatpickr inline range
let __fp; // instância
function initInlineRangeCalendar() {
  const calContainer = document.getElementById('dateCalendar');
  if (!calContainer) return;

  // destrói instância anterior, se houver
  if (__fp && __fp.destroy) { __fp.destroy(); }

  __fp = flatpickr(calContainer, {
    inline: true,
    mode: 'range',
    minDate: 'today',
    dateFormat: 'Y-m-d',
    weekNumbers: false,
    onChange: function(selectedDates) {
      // quando tiver 2 datas, preenche campos
      if (selectedDates.length === 2) {
        const [start, end] = selectedDates;
        const pickup = start.toISOString().slice(0, 10);
        const drop = end.toISOString().slice(0, 10);

        // Preenche inputs readonly
        document.getElementById('pickupDate').value = formatDisplay(pickup);
        document.getElementById('dropoffDate').value = formatDisplay(drop);

        // Calcula diárias (diferença em dias)
        const msPerDay = 24 * 60 * 60 * 1000;
        const days = Math.max(1, Math.round((end - start) / msPerDay));
        document.getElementById('daysCount').textContent = String(days);

        const subtotal = days * __currentDailyPrice;
        document.getElementById('calcSubtotal').textContent = String(subtotal);
        document.getElementById('calcTotal').textContent = String(subtotal);
      }
    }
  });
}

// helper para pegar tradução
function t(key) {
  const dict = window.__i18nDict;
  if (!dict) return key;
  const val = key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  return (typeof val === 'string') ? val : key;
}

// ==== FULL BOOKING (novo) ====
let __fbDailyPrice = 0;
let __fbCar = { id: '', model: '', img: '', seats: '', luggage: '' };
let __fbFP; let __fbTimePick; let __fbTimeDrop;

// ====== MODAL FULL BOOKING - DOIS FLUXOS ======

// Dados globais
let __fbState = {
  flow: 'dates', // 'dates' ou 'form'
  source: 'fleet', // 'fleet' (home) ou 'results' (busca)
  car: {},
  booking: {}
};


// NOVA FUNÇÃO - adicione no final do arquivo
function resetModalState() {
  // Limpar estado global
  __fbState = {
    flow: 'dates',
    source: 'fleet', 
    car: {},
    booking: {}
  };

  // Limpar formulários
  const driverForm = document.getElementById('fbDriverForm');
  if (driverForm) {
    driverForm.remove(); // Remove completamente o formulário anterior
  }

  // ADICIONAR: Limpar campos ocultos anteriores
  document.querySelectorAll('.hidden-booking-field').forEach(el => el.remove());
  
  // Limpar seção de informações
  const infoSection = document.getElementById('fbBookingInfo');
  if (infoSection) {
    infoSection.innerHTML = '';
    infoSection.classList.add('hidden');
  }

  // Garantir que elementos de data estejam visíveis
  const elementsToShow = [
    '#fbDateCalendar',
    '#fbPickupTime', 
    '#fbDropoffTime',
    '#fbPickupAddr',
    '#fbDropoffAddr'
  ];

  elementsToShow.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      el.classList.remove('hidden');
      el.closest('.space-y-3, div')?.classList.remove('hidden');
    }
  });

  // Limpar valores dos campos
  document.getElementById('fbPickupDate').value = '';
  document.getElementById('fbDropoffDate').value = '';
  document.getElementById('fbPickupAddr').value = '';
  document.getElementById('fbDropoffAddr').value = '';
  document.getElementById('fbDays').textContent = '0';
  document.getElementById('fbSubtotal').textContent = '0';
  document.getElementById('fbTotal').textContent = '0';

  // Resetar botão para estado inicial
  const btn = document.getElementById('fbSubmit');
  if (btn) {
    btn.textContent = 'Solicitar Reserva';
    btn.onclick = handleFBSubmit;
  }
}

// Função principal - detecta origem e ajusta comportamento
function openFullBooking(btn) {

  resetModalState();
  
  if (window.initPlacesAutocomplete) initPlacesAutocomplete();

  // Detectar origem do clique
  const isFromResults = btn.closest('#resultsList') !== null;
  const isFromFleet = btn.closest('#fleetSwiper') !== null;

  __fbState.source = isFromResults ? 'results' : 'fleet';

  // Dados do carro
  __fbDailyPrice = Number(btn.dataset.price || 0);
  __fbCar = {
    id: btn.dataset.id || '',
    model: btn.dataset.model || 'Vehicle',
    img: btn.dataset.img || '',
    seats: btn.dataset.seats || '-',
    luggage: btn.dataset.luggage || '-'
  };
  __fbState.car = __fbCar;

  // Preencher dados do carro (sempre)
  document.getElementById('fbCarModel').innerHTML = __fbCar.model;
  document.getElementById('fbCarImg').src = __fbCar.img;
  document.getElementById('fbSeats').innerHTML = `<i class='fas fa-users mr-1'></i> ${__fbCar.seats} assentos`;
  document.getElementById('fbLuggage').innerHTML = `<i class='fas fa-suitcase mr-1'></i> ${__fbCar.luggage} malas`;

  // Definir fluxo baseado na origem
  if (__fbState.source === 'results') {
    openBookingFlowResults();
  } else {
    openBookingFlowFleet();
  }

  // Abrir modal
  const modal = document.getElementById('fullBookingModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  modal.scrollTo(0, 0);
}

// FLUXO A: Vem dos resultados (dados já preenchidos)
function openBookingFlowResults() {
  __fbState.flow = 'form';

  const searchCtx = appState?.search || {};

  hideDateSelectionForm();

  // Preencher dados da busca nos campos informativos
  if (searchCtx.viaSearch) {
    showBookingInfoSection({
      pickupDate: searchCtx.puDateYMD || searchCtx.puDateBR || '',
      dropoffDate: searchCtx.doDateYMD || searchCtx.doDateBR || '',
      pickupTime: searchCtx.puTime || '09:00',
      dropoffTime: searchCtx.doTime || '18:00',
      pickupAddr: searchCtx.puLoc || '',
      dropoffAddr: searchCtx.doLoc || searchCtx.puLoc || '',
      days: searchCtx.days || 1
    });

    // ADICIONAR: Criar campos ocultos para collectBookingFromUI
    createHiddenBookingFields({
      pickupDate: searchCtx.puDateYMD || searchCtx.puDateBR || '',
      dropoffDate: searchCtx.doDateYMD || searchCtx.doDateBR || '',
      pickupTime: searchCtx.puTime || '09:00',
      dropoffTime: searchCtx.doTime || '18:00',
      pickupAddr: searchCtx.puLoc || '',
      dropoffAddr: searchCtx.doLoc || searchCtx.puLoc || ''
    });
  }

  // Mostrar formulário de dados pessoais + pagamento
  showDriverAndPaymentForm();

  // Calcular preço
  const days = Number(searchCtx.days || 1);
  updatePriceDisplay(days, searchCtx.puLoc, searchCtx.doLoc);
}


function createHiddenBookingFields(data) {
  // Remover campos ocultos anteriores se existirem
  document.querySelectorAll('.hidden-booking-field').forEach(el => el.remove());

  const container = document.querySelector('#fullBookingModal');

  // Criar campos ocultos que a collectBookingFromUI consegue ler
  const hiddenFields = [
    { id: 'fbPickupDateHidden', value: data.pickupDate },
    { id: 'fbDropoffDateHidden', value: data.dropoffDate },
    { id: 'fbPickupTimeHidden', value: data.pickupTime },
    { id: 'fbDropoffTimeHidden', value: data.dropoffTime },
    { id: 'fbPickupAddrHidden', value: data.pickupAddr },
    { id: 'fbDropoffAddrHidden', value: data.dropoffAddr }
  ];

  hiddenFields.forEach(field => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = field.id;
    input.value = field.value;
    input.className = 'hidden-booking-field';
    container.appendChild(input);
  });
}

// FLUXO B: Vem da frota (precisa selecionar datas)
function openBookingFlowFleet() {
  __fbState.flow = 'dates';

  // Mostrar seleção de datas/endereços
  showDateSelectionForm();

  // Esconder formulário de dados pessoais
  hideDriverAndPaymentForm();

  // Inicializar calendários
  initFullBookingCalendars();
}

// Mostrar informações da reserva (modo informativo)
function showBookingInfoSection(data) {
  const infoSection = document.getElementById('fbBookingInfo') || createBookingInfoSection();

  infoSection.innerHTML = `
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="text-blue-700 font-medium" data-i18n="search.pickupLocation">Retirada:</label>
          <div class="text-blue-900">${formatDisplayDate(data.pickupDate)} - ${data.pickupTime}</div>
          <div class="text-blue-700 text-xs">${data.pickupAddr}</div>
        </div>
        <div>
          <label class="text-blue-700 font-medium" data-i18n="search.altDropoff">Devolução:</label>
          <div class="text-blue-900">${formatDisplayDate(data.dropoffDate)} - ${data.dropoffTime}</div>
          <div class="text-blue-700 text-xs">${data.dropoffAddr}</div>
        </div>
      </div>
    </div>
  `;

  infoSection.classList.remove('hidden');
  document.getElementById('fbDateSection').classList.add('hidden');
}

// Criar seção de informações se não existir
function createBookingInfoSection() {
  const container = document.querySelector('#fullBookingModal .space-y-3');
  const infoSection = document.createElement('div');
  infoSection.id = 'fbBookingInfo';
  container.insertBefore(infoSection, container.firstChild);
  return infoSection;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toISOString().slice(0, 10);
}

// Mostrar formulário de seleção de datas
function showDateSelectionForm() {

  // Garantir que elementos existam e estejam visíveis
  const elementsToShow = ['fbDateCalendar', 'fbPickupTime', 'fbDropoffTime', 'fbPickupAddr', 'fbDropoffAddr'];

  elementsToShow.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
      el.classList.remove('hidden');
      // Também mostrar o container pai
      const parent = el.closest('.space-y-3, div');
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('hidden');
      }
    }
  });

  // Mostrar seção de datas inteira
  const dateSection = document.getElementById('fbDateSection');
  if (dateSection) {
    dateSection.style.display = 'block';
    dateSection.classList.remove('hidden');
  }

  updateSubmitButton('continue');
}

// Mostrar formulário de dados do motorista + pagamento
function showDriverAndPaymentForm() {

  // Esconder seleção de datas se visível
  hideDateSelectionForm();

  // Verificar se já existe o formulário
  let formSection = document.getElementById('fbDriverForm');

  if (!formSection) {
    formSection = createDriverForm();
  }

  if (formSection) {
    formSection.classList.remove('hidden');
    formSection.style.display = 'block';
  }

  // Atualizar botão para "Finalizar Reserva"
  updateSubmitButton('submit');
}

// Esconder formulário de dados pessoais
function hideDriverAndPaymentForm() {
  const formSection = document.getElementById('fbDriverForm');
  if (formSection) {
    formSection.classList.add('hidden');
  }
}

// Esconder seleção de datas
function hideDateSelectionForm() {
  const elementsToHide = [
    '#fbDateCalendar',
    '#fbPickupTime',
    '#fbDropoffTime', 
    '#fbPickupAddr',
    '#fbDropoffAddr'
  ];

  elementsToHide.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.display = 'none';
      el.classList.add('hidden');
      // Não esconder o container pai pois pode ter outros elementos
    }
  });

  // Esconder seção de datas inteira se existir
  const dateSection = document.getElementById('fbDateSection');
  if (dateSection) {
    dateSection.style.display = 'none';
    dateSection.classList.add('hidden');
  }
  
}

// Criar formulário de dados do motorista
function createDriverForm() {
  const container = document.querySelector('#fullBookingModal .space-y-3') || 
                   document.querySelector('#fullBookingModal .p-3');

  if (!container) return null;

  const formSection = document.createElement('div');
  formSection.id = 'fbDriverForm';
  formSection.className = 'space-y-4';

  formSection.innerHTML = `
    <!-- ===== DADOS DO CONDUTOR COM GOOGLE LOGIN INTEGRADO ===== -->
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-gray-900" data-i18n="fb.contact.driver">Condutor</h4>
    
        <!-- Botão Google compacto -->
        <div class="flex items-center gap-2">
          <div id="googleLoginButton" class="google-login-btn"></div>
        </div>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.contact.nameLabel">Nome Completo</label>
          <input id="fbDriverName" type="text" required class="w-full p-2 border rounded-lg" placeholder="Carlos Smith">
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.contact.birthdate">Data de Nascimento</label>
          <input id="fbDriverBirth" type="text" required class="w-full p-2 border rounded-lg" readonly>
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.contact.emailLabel">E-mail</label>
          <input id="fbDriverEmailForm" type="email" required class="w-full p-2 border rounded-lg" placeholder="carlos@email.com">
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.contact.phoneLabel">Celular (com DDI)</label>
          <input id="fbDriverWhatsapp" type="tel" required class="w-full p-2 border rounded-lg" placeholder="+55 11 99999-9999">
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.contact.driverlicense">Número da CNH</label>
          <input id="fbDriverLicense" type="text" required class="w-full p-2 border rounded-lg" placeholder="12345678910">
        </div>
      </div>
    </div>

    <!-- ===== PAGAMENTO ===== -->
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 class="font-semibold text-gray-900 mb-3" data-i18n="fb.payment.title">Pagamento</h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.payment.methodLabel">Forma de Pagamento</label>
          <select id="fbPaymentMethod" class="w-full p-2 border rounded-lg">
            <option value="credit" data-i18n="fb.payment.credit">Cartão de Crédito (até 10x sem juros)</option>
            <option value="pix" data-i18n="fb.payment.pix">PIX (5% desconto)</option>
            <option value="transfer" data-i18n="fb.payment.transfer">Transferência Bancária</option>
          </select>
        </div>
        <div id="fbCreditOptions" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.payment.installmentsLabel">Parcelas</label>
            <select id="fbInstallments" class="w-full p-2 border rounded-lg">
              <option value="1" data-i18n="fb.payment.installments1">1x à vista</option>
              <option value="2" data-i18n="fb.payment.installments2">2x sem juros</option>
              <option value="3" data-i18n="fb.payment.installments3">3x sem juros</option>
              <option value="6" data-i18n="fb.payment.installments6">6x sem juros</option>
              <option value="10" data-i18n="fb.payment.installments10">10x sem juros</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1" data-i18n="fb.payment.installmentValueLabel">Valor da Parcela</label>
            <input id="fbInstallmentValue" type="text" readonly class="w-full p-2 border rounded-lg bg-gray-50" placeholder="$0.00" data-i18n-placeholder="fb.payment.installmentValuePh">
          </div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(formSection);

  // Adicionar listeners de pagamento
  setupPaymentListeners();

  // ===== INICIALIZAR BOTÃO GOOGLE =====
  // Aguardar um pouco para o DOM estar pronto
  setTimeout(() => {
    initializeGoogleLoginButton();
  }, 100);

  return formSection;
}

// Função para inicializar o botão Google no modal
function initializeGoogleLoginButton() {
  if (typeof createGoogleLoginButton === 'function') {
    createGoogleLoginButton('googleLoginButton', {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular'
    });
  }
}

// Configurar listeners de pagamento
function setupPaymentListeners() {
  const methodSelect = document.getElementById('fbPaymentMethod');
  const creditOptions = document.getElementById('fbCreditOptions');
  const installmentsSelect = document.getElementById('fbInstallments');
  const installmentValue = document.getElementById('fbInstallmentValue');

  // Mostrar/esconder opções de cartão
  methodSelect?.addEventListener('change', () => {
    const isCredit = methodSelect.value === 'credit';
    creditOptions.classList.toggle('hidden', !isCredit);
  });

  // Calcular valor da parcela
  installmentsSelect?.addEventListener('change', () => {
    const total = parseFloat(document.getElementById('fbTotal')?.textContent || '0');
    const installments = parseInt(installmentsSelect.value || '1');
    const value = total / installments;
    installmentValue.value = `$${value.toFixed(2)}`;
  });

  // ADICIONAR CALENDÁRIO PARA DATA DE NASCIMENTO
  const birthInput = document.getElementById('fbDriverBirth');
  if (birthInput) {
    flatpickr(birthInput, {
      dateFormat: 'Y-m-d',
      maxDate: 'today',
      yearRange: [1940, new Date().getFullYear() - 18],
      defaultDate: null,
      allowInput: false
    });
  }
  
}

// Atualizar botão submit baseado no fluxo
function updateSubmitButton(type) {
  const btn = document.getElementById('fbSubmit');
  
  if (!btn) return;

  if (type === 'continue') {
    btn.textContent = 'Continue';
    btn.onclick = handleContinueToForm; 
  } else {
    btn.textContent = 'Concluir';
    btn.onclick = handleFBSubmit;
  }
}

// Handler para continuar do fluxo de datas para formulário
function handleContinueToForm(e) {

  e?.preventDefault();
  
  // Validar se tem datas e endereços
  const pickupDate = document.getElementById('fbPickupDate')?.textContent || 
                    document.getElementById('fbPickupDate')?.value;
  const dropoffDate = document.getElementById('fbDropoffDate')?.textContent || 
                     document.getElementById('fbDropoffDate')?.value;
  const pickupAddr = document.getElementById('fbPickupAddr')?.value;
  const dropoffAddr = document.getElementById('fbDropoffAddr')?.value;

  if (!pickupDate || !dropoffDate) {
    showError('Selecione as datas de retirada e devolução');
    return;
  }

  if (!pickupAddr || !dropoffAddr) {
    showError('Informe os endereços de retirada e devolução');
    return;
  }

  // Salvar dados da reserva
  __fbState.booking = {
    pickupDate, dropoffDate,
    pickupTime: document.getElementById('fbPickupTime')?.value || '09:00',
    dropoffTime: document.getElementById('fbDropoffTime')?.value || '18:00',
    pickupAddr, dropoffAddr
  };

  // Mostrar como informativo
  showBookingInfoSection({
    pickupDate, dropoffDate,
    pickupTime: __fbState.booking.pickupTime,
    dropoffTime: __fbState.booking.dropoffTime,
    pickupAddr, dropoffAddr,
    days: parseInt(document.getElementById('fbDays')?.textContent || '1')
  });

  // Ir para formulário
  showDriverAndPaymentForm();

  __fbState.flow = 'form';

  createHiddenBookingFields({
    pickupDate: pickupDate,
    dropoffDate: dropoffDate,
    pickupTime: __fbState.booking.pickupTime,
    dropoffTime: __fbState.booking.dropoffTime,
    pickupAddr: pickupAddr,
    dropoffAddr: dropoffAddr
  });
  
}


function updatePriceDisplay(days, pickupAddr, dropoffAddr) {
  setFBText('fbDays', String(days));

  const dailyPrice = __fbDailyPrice || 0;
  const subtotal = days * dailyPrice;
  const locationFee = calculateLocationFee(pickupAddr, dropoffAddr);
  const total = subtotal + locationFee;

  setFBText('fbSubtotal', String(subtotal));
  setFBText('fbLocationFee', String(locationFee));
  setFBText('fbTotal', String(total));

  const locationFeeRow = document.getElementById('fbLocationFeeRow');
  if (locationFeeRow) {
    locationFeeRow.classList.toggle('hidden', locationFee === 0);
  }
}

function showError(message) {
  const err = document.getElementById('fbError');
  if (err) {
    err.textContent = message;
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 5000);
  }
}

function closeFullBooking(){
  const m = document.getElementById('fullBookingModal');
  m.classList.add('hidden'); m.classList.remove('flex');
  document.body.style.overflow = '';
}

function handleFBSubmit(e) {
  e?.preventDefault?.();
  e?.stopPropagation?.();

  const isViaSearch = !!(appState?.search?.viaSearch && Number(appState.search.days) > 0);

  const err = document.getElementById('fbError');
  err.classList.add('hidden'); 
  err.textContent = '';

  // Verificar se está usando formulário completo ou básico
  const driverForm = document.getElementById('fbDriverForm');
  const isCompleteForm = driverForm && !driverForm.classList.contains('hidden');

  let email, whatsapp;

  if (isCompleteForm) {
    email = (document.getElementById('fbDriverEmailForm')?.value || '').trim();
    whatsapp = (document.getElementById('fbDriverWhatsapp')?.value || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = 'E-mail inválido';
      err.classList.remove('hidden'); 
      return;
    }

    if (!whatsapp || !/^\+?\d[\d\s().-]{6,}$/.test(whatsapp)) {
      err.textContent = 'Telefone inválido';
      err.classList.remove('hidden'); 
      return;
    }
  } 

  const daysEl = Number(document.getElementById('fbDays')?.textContent || '0');
  const days = daysEl || Number(appState?.search?.days || 0);

  const pickupInput = document.getElementById('fbPickupAddr');
  const dropoffInput = document.getElementById('fbDropoffAddr');

  if (!isViaSearch) {
    const onlyFL = (val) => /(,\s*FL\b|Florida\b)/i.test(val || '');
    const okFL = onlyFL(pickupInput?.value) && onlyFL(dropoffInput?.value);
    if (!days) { 
      err.textContent = 'Selecione as datas'; 
      err.classList.remove('hidden'); 
      return; 
    }
    if (!okFL) { 
      err.textContent = 'Endereços devem ser na Florida'; 
      err.classList.remove('hidden'); 
      return; 
    }
  }

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? (('value' in el) ? (el.value || '') : (el.textContent || '')) : '';
  };

  const text = encodeURIComponent(
`Solicitação de reserva
Carro: ${__fbCar.model}
Retirada: ${getVal('fbPickupDate')} ${getVal('fbPickupTime')} - ${(pickupInput?.value || '')}
Devolução: ${getVal('fbDropoffDate')} ${getVal('fbDropoffTime')} - ${(dropoffInput?.value || '')}
Diárias: ${days}
Total: $${getVal('fbTotal')}.00
Email: ${email}
WhatsApp: ${whatsapp}`
  );

  const waUrl = `https://wa.me/+5511987195105?text=${text}`;
  closeFullBooking();
  startBookingProcessedFlow();
}

function initFullBookingCalendars(prefill){
  const cal = document.getElementById('fbDateCalendar');
  if(!cal) return;

  // destruir instâncias anteriores
  if(__fbFP && __fbFP.destroy) __fbFP.destroy();
  if(__fbTimePick && __fbTimePick.destroy) __fbTimePick.destroy();
  if(__fbTimeDrop && __fbTimeDrop.destroy) __fbTimeDrop.destroy();

  // Calendário inline (range)
  __fbFP = flatpickr(cal, {
    inline: true,
    mode: 'range',
    minDate: 'today',
    dateFormat: 'Y-m-d',
    weekNumbers: false,
    showMonths: 1,
    onChange(selected){
      if(selected.length === 2){
        const [start, end] = selected;
        const pu  = start.toISOString().slice(0,10);
        const dof = end.toISOString().slice(0,10);
        setFBText('fbPickupDate', formatDisplay(pu));  // exibe legível
        setFBText('fbDropoffDate', formatDisplay(dof));
        calcFBPrice(start, end);                       // atualiza dias/subtotal/total
      }
    }
  });

  // Time pickers (aceitam string 'HH:mm' ou Date)
  __fbTimePick = flatpickr('#fbPickupTime',  {
    enableTime:true, noCalendar:true, dateFormat:'H:i', time_24hr:true,
    defaultDate: prefill?.pickupTime || '09:00'
  });
  __fbTimeDrop = flatpickr('#fbDropoffTime', {
    enableTime:true, noCalendar:true, dateFormat:'H:i', time_24hr:true,
    defaultDate: prefill?.dropoffTime || '18:00'
  });

  // Se veio prefill com o range, aplicamos e disparamos onChange
  if (prefill?.range?.length === 2) {
    __fbFP.setDate(prefill.range, true); // 'true' dispara onChange -> calcula preço e preenche labels
  } else {
    // Sem prefill, limpa os campos visuais
    setFBText('fbPickupDate','');
    setFBText('fbDropoffDate','');
    setFBText('fbDays','0');
    setFBText('fbSubtotal','0');
    setFBText('fbTotal','0');
  }

  const btnSubmit = document.getElementById('fbSubmit');
  if (btnSubmit) {
    btnSubmit.type = 'button';            // evita submit do form
    //btnSubmit.onclick = handleFBSubmit; (re)liga sempre que abrir o modal
  }

  function addLocationFeeListeners() {
    const pickupInput = document.getElementById('fbPickupAddr');
    const dropoffInput = document.getElementById('fbDropoffAddr');

    if (pickupInput) {
      pickupInput.addEventListener('change', () => {
        // Recalcular se já tem datas selecionadas
        const fbPickupDate = document.getElementById('fbPickupDate')?.textContent || document.getElementById('fbPickupDate')?.value;
        const fbDropoffDate = document.getElementById('fbDropoffDate')?.textContent || document.getElementById('fbDropoffDate')?.value;

        if (fbPickupDate && fbDropoffDate) {
          const start = new Date(fbPickupDate);
          const end = new Date(fbDropoffDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            calcFBPrice(start, end);
          }
        }
      });
    }

    if (dropoffInput) {
      dropoffInput.addEventListener('change', () => {
        // Recalcular se já tem datas selecionadas
        const fbPickupDate = document.getElementById('fbPickupDate')?.textContent || document.getElementById('fbPickupDate')?.value;
        const fbDropoffDate = document.getElementById('fbDropoffDate')?.textContent || document.getElementById('fbDropoffDate')?.value;

        if (fbPickupDate && fbDropoffDate) {
          const start = new Date(fbPickupDate);
          const end = new Date(fbDropoffDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            calcFBPrice(start, end);
          }
        }
      });
    }
  }
    
  addLocationFeeListeners();
}

function setFBText(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if ('value' in el) el.value = val; else el.textContent = val;
}

function calcFBPrice(start, end) {
  const ms = 86400000;
  const days = Math.max(1, Math.round((end - start) / ms));
  setFBText('fbDays', String(days));

  const dailyPrice = __fbDailyPrice || 0;
  const subtotal = days * dailyPrice;

  // CALCULAR TAXA DE LOCALIZAÇÃO
  const pickupAddr = document.getElementById('fbPickupAddr')?.value || '';
  const dropoffAddr = document.getElementById('fbDropoffAddr')?.value || '';
  const locationFee = calculateLocationFee(pickupAddr, dropoffAddr);

  // ATUALIZAR VALORES
  setFBText('fbSubtotal', String(subtotal));
  setFBText('fbLocationFee', String(locationFee));

  const total = subtotal + locationFee;
  setFBText('fbTotal', String(total));

  // MOSTRAR/ESCONDER A LINHA DA TAXA
  const locationFeeRow = document.getElementById('fbLocationFeeRow');
  if (locationFeeRow) {
    if (locationFee > 0) {
      locationFeeRow.classList.remove('hidden');
    } else {
      locationFeeRow.classList.add('hidden');
    }
  }
}

  /** UTIL: mostrar/ocultar */
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }

  /** Gera código de reserva: MLC-ORL-YYYY-MM-DD-AB12 */
  function generateBookingCode(hub = 'ORL'){
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    const y = d.getFullYear(), m = pad(d.getMonth()+1), day = pad(d.getDate());
    const rand = Math.random().toString(36).slice(-4).toUpperCase();
    return `MLC-${hub}-${y}-${m}-${day}-${rand}`;
  }

  /** Mascara e-mail: mario@gmail.com -> m***@gmail.com */
  function maskEmail(email=''){
    if(!email || !email.includes('@')) return '—';
    const [u, domain] = email.split('@');
    const visible = u.slice(0,1);
    return `${visible}${'*'.repeat(Math.max(1, u.length-1))}@${domain}`;
  }

  /** Lê dados do UI de forma resiliente ao baseline */
function collectBookingFromUI(){
  const $ = sel => document.querySelector(sel);
  const vehicle = (document.getElementById('fbCarModel')?.textContent || '—').trim();

  // Função helper para pegar valores dos campos (visível primeiro, depois oculto)
  const getFieldValue = (visibleId, hiddenId) => {
    const visible = document.getElementById(visibleId);
    if (visible && !visible.classList.contains('hidden') && (visible.value || visible.textContent)) {
      return visible.value || visible.textContent;
    }
    const hidden = document.getElementById(hiddenId);
    return hidden ? hidden.value : '—';
  };

  // Pegar dados com fallback para campos ocultos
  const pickupDate = getFieldValue('fbPickupDate', 'fbPickupDateHidden');
  const dropoffDate = getFieldValue('fbDropoffDate', 'fbDropoffDateHidden');
  const pickupTime = getFieldValue('fbPickupTime', 'fbPickupTimeHidden');
  const dropoffTime = getFieldValue('fbDropoffTime', 'fbDropoffTimeHidden');
  const pickupLoc = getFieldValue('fbPickupAddr', 'fbPickupAddrHidden');
  const dropoffLoc = getFieldValue('fbDropoffAddr', 'fbDropoffAddrHidden');

  const extras = Array.from(document.querySelectorAll('[data-extra-selected="true"]'))
                 .map(el => el.getAttribute('data-extra-name')).filter(Boolean).join(', ') || '—';

  const days = $('#fbDays')?.textContent?.trim() || '—';
  const total = $('#fbTotal')?.textContent?.trim() || $('#fbSubtotal')?.textContent?.trim() || '—';

  // Pegar nome e email do formulário de motorista se existir, senão dos campos básicos
  const name = $('#fbDriverName')?.value || $('#fbCustomerName')?.value || $('#customerName')?.value || '—';
  const email = $('#fbDriverEmailForm')?.value || $('#fbEmail')?.value || $('#customerEmail')?.value || '—';

  console.log('DEBUG - Email coletado:', email);
  console.log('DEBUG - Campo fbDriverEmailForm:', $('#fbDriverEmailForm')?.value);
  console.log('DEBUG - Campo fbEmail:', $('#fbEmail')?.value);
  

  return {
    vehicle, 
    pickupDate, 
    dropoffDate, 
    pickupTime, 
    dropoffTime,
    pickupLocation: pickupLoc, 
    dropoffLocation: dropoffLoc,
    extras, 
    days, 
    total,
    fullName: name, 
    email,
    phone: extractPhone(),
    driverLicense: extractDriverLicense(),
    subtotal: extractSubtotal(),
    locationFee: extractLocationFee(),
    paymentMethod: extractPaymentMethod(),
    installments: extractInstallments()
  };
}

  /** Salva no localStorage (pendente) */
  function savePendingBooking(obj){
    try {
      const key = 'pendingBookings';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift({ ...obj, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list.slice(0,10))); // guarda últimas 10
    } catch(e){ /* ignore */ }
  }

  /** Gera arquivo ICS (evento) e retorna URL para download */
  function buildICS(booking){
    // Monta datas no formato YYYYMMDDTHHMMSS (sem fuso, suficiente)
    function parseDDMMYYYY(s){ const [dd,mm,yy] = s.split('/'); return {dd,mm,yy}; }
    function HHMMToHHMM(hhmm){ const [h,m] = (hhmm||'00:00').split(':'); return {h: (h||'00').padStart(2,'0'), m:(m||'00').padStart(2,'0')}; }

    const pD = parseDDMMYYYY(booking.pickupDate||'01/01/2025');
    const dD = parseDDMMYYYY(booking.dropoffDate||booking.pickupDate||'01/01/2025');
    const pT = HHMMToHHMM(booking.pickupTime||'10:00');
    const dT = HHMMToHHMM(booking.dropoffTime||'10:00');

    const dtStart = `${pD.yy}${pD.mm}${pD.dd}T${pT.h}${pT.m}00`;
    const dtEnd   = `${dD.yy}${dD.mm}${dD.dd}T${dT.h}${dT.m}00`;

    const summary = `Reserva ${booking.vehicle} • MyLuxCars`;
    const location = `${booking.pickupLocation||''} → ${booking.dropoffLocation||''}`.trim();
    const notes = `Código: ${booking.code}\nDias: ${booking.days}\nTotal: ${booking.total}\nExtras: ${booking.extras || '-'}`;

    const ics =
  `BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//MYLUXCARS//Booking//PT-BR
  CALSCALE:GREGORIAN
  BEGIN:VEVENT
  UID:${booking.code}@myluxcars
  DTSTAMP:${dtStart}
  DTSTART:${dtStart}
  DTEND:${dtEnd}
  SUMMARY:${summary}
  LOCATION:${location}
  DESCRIPTION:${notes.replace(/\n/g,'\\n')}
  END:VEVENT
  END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    return URL.createObjectURL(blob);
  }

  /** Abre o modal preenchendo os campos */
  function openBookingProcessedModal(data){
    const $ = sel => document.querySelector(sel);
    $('#bpCode').textContent = data.code;
    $('#bpVehicle').textContent = data.vehicle;

    // PICKUP (com <br>)
    const p = $('#bpPickup');
    p.textContent = `${data.pickupDate} - ${data.pickupTime} `;
    p.appendChild(document.createElement('br'));
    p.append(data.pickupLocation);

    // DROPOFF (com <br>)
    const d = $('#bpDropoff');
    d.textContent = `${data.dropoffDate} - ${data.dropoffTime} `;
    d.appendChild(document.createElement('br'));
    d.append(data.dropoffLocation);

    $('#bpExtras').textContent  = data.extras;
    $('#bpDays').textContent    = data.days;
    $('#bpTotal').textContent   = data.total;
    $('#bpEmail').textContent   = maskEmail(data.email);

    // Link de acompanhamento (pode apontar para /reserva?code=...)
    //const trackUrl = `/reserva?code=${encodeURIComponent(data.code)}`;
    const icsUrl = buildICS(data);

    //$('#bpTrack').setAttribute('href', trackUrl);
    $('#bpICS').setAttribute('href', icsUrl);

    const modal = document.getElementById('bookingProcessedModal');
    show(modal);                                 // <- tira o hidden
    document.documentElement.classList.add('overflow-hidden'); // <- trava scroll

    // Foco acessível no título
    setTimeout(()=> document.getElementById('bookingProcessedTitle')?.focus(), 10);
  }


// ====== INTEGRAÇÃO GOOGLE SHEETS - MYLUXCARS ======

// Configurações do Google Sheets
const SHEETS_CONFIG = {
  get SHEET_ID() { return CONFIG.SHEETS_ID; },
  get API_KEY() { return CONFIG.SHEETS_API_KEY; },
  RANGE: 'Reservas!A:T'
};

// Estrutura das colunas na planilha
const COLUMNS = {
  A: 'code',           // Código da reserva
  B: 'createdAt',      // Data/hora criação
  C: 'vehicle',        // Veículo
  D: 'pickupDate',     // Data retirada
  E: 'pickupTime',     // Hora retirada  
  F: 'pickupLocation', // Local retirada
  G: 'dropoffDate',    // Data devolução
  H: 'dropoffTime',    // Hora devolução
  I: 'dropoffLocation',// Local devolução
  J: 'days',           // Número de diárias
  K: 'subtotal',       // Subtotal
  L: 'locationFee',    // Taxa adicional
  M: 'total',          // Valor total
  N: 'fullName',       // Nome completo
  O: 'email',          // Email
  P: 'phone',          // Telefone
  Q: 'driverLicense',  // CNH
  R: 'paymentMethod',  // Forma de pagamento
  S: 'installments',   // Parcelas
  T: 'status'          // Status da reserva
};

// Função principal para salvar reserva no Google Sheets
async function saveBookingToSheets(booking) {
  const WEB_APP_URL = CONFIG.WEB_APP_URL;
  
  try {
    console.log('📋 Dados que vão ser enviados:', booking);

    // Criar FormData
    const formData = new FormData();
    Object.keys(booking).forEach(key => {
      formData.append(key, booking[key] || '');
    });

    // Usar modo 'no-cors' para evitar problemas
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    console.log('✅ Dados enviados para Google Sheets (modo no-cors)');

    return { success: true, code: booking.code };

  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
    saveBookingLocally(booking);
    return { success: false, error: error.message };
  }
}

// Funções auxiliares para extrair dados específicos do formulário
function extractSubtotal() {
  return document.getElementById('fbSubtotal')?.textContent || '0';
}

function extractLocationFee() {
  return document.getElementById('fbLocationFee')?.textContent || '0';
}

function extractPhone() {
  // Tentar campos do formulário completo primeiro
  const driverPhone = document.getElementById('fbDriverWhatsapp');
  if (driverPhone && driverPhone.value) {
    return driverPhone.value;
  }

  // Fallback para campos básicos
  const basicPhone = document.getElementById('fbWhatsapp');
  if (basicPhone && basicPhone.value) {
    return basicPhone.value;
  }

  return '';
}

function extractDriverLicense() {
  const licenseField = document.getElementById('fbDriverLicense');
  if (licenseField && licenseField.value) {
    return licenseField.value;
  }

  return '';
}

function extractPaymentMethod() {
  const paymentSelect = document.getElementById('fbPaymentMethod');
  return paymentSelect?.options[paymentSelect.selectedIndex]?.text || '';
}

function extractInstallments() {
  const installmentSelect = document.getElementById('fbInstallments');
  return installmentSelect?.value || '1';
}

// Salvar localmente como backup
function saveBookingLocally(booking) {
  try {
    const key = 'myluxcars_bookings';
    const bookings = JSON.parse(localStorage.getItem(key) || '[]');
    bookings.unshift({
      ...booking,
      savedAt: new Date().toISOString(),
      source: 'localStorage_backup'
    });
    localStorage.setItem(key, JSON.stringify(bookings.slice(0, 100))); // Máximo 100 reservas
    console.log('💾 Reserva salva localmente como backup');
  } catch (error) {
    console.error('❌ Erro ao salvar backup local:', error);
  }
}

// Buscar reserva por código no Google Sheets
async function lookupBookingInSheets(code) {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_CONFIG.SHEET_ID}/values/${SHEETS_CONFIG.RANGE}?key=${SHEETS_CONFIG.API_KEY}`);

    if (!response.ok) {
      throw new Error('Erro na API do Google Sheets');
    }

    const data = await response.json();
    const rows = data.values || [];

    // Procurar pela reserva (código está na coluna A)
    const foundRow = rows.find(row => row[0] && row[0].toUpperCase() === code.toUpperCase());

    if (foundRow) {
      return {
        code: foundRow[0],
        createdAt: foundRow[1],
        vehicle: foundRow[2],
        pickupDate: foundRow[3],
        pickupTime: foundRow[4],
        pickupLocation: foundRow[5],
        dropoffDate: foundRow[6],
        dropoffTime: foundRow[7],
        dropoffLocation: foundRow[8],
        days: foundRow[9],
        subtotal: foundRow[10],
        locationFee: foundRow[11],
        total: foundRow[12],
        fullName: foundRow[13],
        email: foundRow[14],
        phone: foundRow[15],
        driverLicense: foundRow[16],
        paymentMethod: foundRow[17],
        installments: foundRow[18],
        status: foundRow[19]
      };
    }

    return null;

  } catch (error) {
    console.error('❌ Erro ao buscar reserva:', error);
    return null;
  }
}

async function startBookingProcessedFlow() {
  const btn = document.getElementById('fbSubmit');
  if (btn) { 
    btn.disabled = true; 
    btn.classList.add('opacity-70', 'cursor-not-allowed'); 
  }

  show(document.getElementById('bookingProcessingOverlay'));

  try {
    // Coleta dados + gera código
    const booking = collectBookingFromUI();
    booking.code = generateBookingCode('ORL');

    console.log('📋 Dados coletados:', booking);

    // Salvar no Google Sheets
    const saveResult = await saveBookingToSheets(booking);

    if (saveResult.success) {
      console.log('✅ Reserva salva no Google Sheets');
    } else {
      console.warn('⚠️ Falha no Google Sheets, usando backup local');
    }

    // 🆕 ENVIAR EMAILS
    const emailResult = await sendBookingEmails(booking);

    if (emailResult.success) {
      console.log('✅ Emails de confirmação enviados');
    } else {
      console.warn('⚠️ Falha no envio de emails:', emailResult.error);
    }

    // Simula processamento adicional
    await new Promise(r => setTimeout(r, 1600));

    hide(document.getElementById('bookingProcessingOverlay'));
    openBookingProcessedModal(booking);

  } catch (error) {
    console.error('❌ Erro no processamento da reserva:', error);

    hide(document.getElementById('bookingProcessingOverlay'));

    const err = document.getElementById('fbError');
    if (err) {
      err.textContent = 'Erro ao processar reserva. Tente novamente.';
      err.classList.remove('hidden');
    }
  } finally {
    if (btn) { 
      btn.disabled = false; 
      btn.classList.remove('opacity-70', 'cursor-not-allowed'); 
    }
  }
}



  /** Copiar código */
  function copyText(text){
    if (!navigator.clipboard) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove(); return;
    }
    navigator.clipboard.writeText(text).catch(()=>{});
  }

(function initProcessedModal(){
  const $ = sel => document.querySelector(sel);
  const modal = document.getElementById('bookingProcessedModal');

  // copiar código (mantém como está)
  $('#bpCopy')?.addEventListener('click', ()=>{
    const code = document.getElementById('bpCode').textContent.trim();
    copyText(code);
    const t = document.createElement('div');
    t.textContent = 'Ok!';
    t.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm z-[120]';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 1800);
  });

  // fechar modal + liberar scroll + (opcional) voltar para Home da SPA
  const closeAll = ()=>{
    if (!modal) return;
    hide(modal);
    document.documentElement.classList.remove('overflow-hidden');
    // Se estiver usando SPA-lite e quiser voltar para a Home:
    if (location.hash === '#results') location.hash = '#home';
    // Scroll opcional
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // botões
  $('#bpClose')?.addEventListener('click', closeAll);   // "Voltar ao início"
  $('#bpCloseX')?.addEventListener('click', closeAll);  // X no header

  // clicar no backdrop fecha
  modal?.addEventListener('click', (e)=>{ if (e.target === modal) closeAll(); });

  // ESC fecha
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeAll();
  });
})();

  (function(){
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const closeBtn = document.getElementById('mobileMenuClose');

    function openMenu(){
      menu.classList.remove('hidden');
      document.documentElement.classList.add('overflow-hidden');
      btn?.setAttribute('aria-expanded','true');
    }
    function closeMenu(){
      menu.classList.add('hidden');
      document.documentElement.classList.remove('overflow-hidden');
      btn?.setAttribute('aria-expanded','false');
    }

    btn?.addEventListener('click', openMenu);
    overlay?.addEventListener('click', closeMenu);
    closeBtn?.addEventListener('click', closeMenu);

    // Fechar ao clicar num link
    menu.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', closeMenu);
    });

    // ESC fecha
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) closeMenu();
    });
  })();


  /* === UTIL de modal === */
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }

  /* === 3.A Abrir/fechar modal de consulta === */
  (function initLookupModal(){
    const btn = document.getElementById('navLookup');
    const btnMobile = document.getElementById('mobileLookupLink');
    const modal = document.getElementById('bookingLookupModal');
    const closeBtn = document.getElementById('lookupClose');
    const closeX = document.getElementById('lookupCloseX');

    function open(){ show(modal); document.documentElement.classList.add('overflow-hidden'); }
    function close(){ hide(modal); document.documentElement.classList.remove('overflow-hidden'); }

    btn?.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
    btnMobile?.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
    closeBtn?.addEventListener('click', close);
    closeX?.addEventListener('click', close);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  })();

  /* === 3.B Persistência: front agora, backend quando existir === */
  async function persistBooking(booking){
    // LocalStorage (sempre)
    try {
      const key = 'bookings';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      // se já existir com o mesmo code, substitui
      const idx = list.findIndex(b => b.code === booking.code);
      if (idx >= 0) list[idx] = booking; else list.unshift(booking);
      localStorage.setItem(key, JSON.stringify(list.slice(0,200)));
    } catch (e) {}

    // Backend (opcional): tenta POST /api/bookings; se 404, ignora
    try {
      await fetch('/api/bookings', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(booking)
      });
    } catch (e) {
      // sem backend, tudo bem
    }
  }

  /* === 3.C Consulta por código === */
async function lookupBookingByCode(code) {
  code = String(code || '').trim();
  if (!code) return null;

  console.log('🔍 Buscando reserva:', code);

  // 1) Tentar Google Sheets primeiro
  try {
    const sheetsResult = await lookupBookingInSheets(code);
    if (sheetsResult) {
      console.log('✅ Reserva encontrada no Google Sheets');
      return sheetsResult;
    }
  } catch (error) {
    console.warn('⚠️ Erro ao consultar Google Sheets, tentando fallbacks');
  }

  // 2) Fallback: localStorage
  try {
    const localBookings = JSON.parse(localStorage.getItem('myluxcars_bookings') || '[]');
    const found = localBookings.find(b => b.code === code);
    if (found) {
      console.log('✅ Reserva encontrada no localStorage');
      return found;
    }
  } catch (error) {
    console.error('❌ Erro ao consultar localStorage:', error);
  }

  // 3) Fallback: bookings.json estático (mantém compatibilidade)
  try {
    const response = await fetch('/bookings.json', { cache: 'no-store' });
    if (response.ok) {
      const arr = await response.json();
      if (Array.isArray(arr)) {
        const found = arr.find(b => String(b.code).toUpperCase() === code.toUpperCase());
        if (found) {
          console.log('✅ Reserva encontrada no bookings.json');
          return found;
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ bookings.json não encontrado');
  }

  console.log('❌ Reserva não encontrada em nenhuma fonte');
  return null;
}

// Função de teste para verificar a integração
async function testSheetsIntegration() {
  const testBooking = {
    code: 'TEST-' + Date.now(),
    vehicle: 'Tesla Model S (Teste)',
    pickupDate: '2024-12-01',
    pickupTime: '10:00',
    pickupLocation: 'Orlando Airport, FL',
    dropoffDate: '2024-12-03',
    dropoffTime: '18:00',
    dropoffLocation: 'Disney Springs, FL',
    days: '2',
    total: '500',
    fullName: 'João Teste',
    email: 'teste@email.com'
  };

  console.log('🧪 Testando integração Google Sheets...');
  const result = await saveBookingToSheets(testBooking);
  console.log('🧪 Resultado do teste:', result);

  return result;
}


  /* === 3.D UI da consulta === */
  (function initLookupUI(){
    const $ = (s)=>document.querySelector(s);
    const input = $('#lookupCode');
    const btn = $('#lookupBtn');
    const boxResult = $('#lookupResult');
    const boxEmpty = $('#lookupEmpty');
    const boxErr = $('#lookupError');

    function setBr(el, top, bottom){
      el.textContent = ''; 
      el.append(document.createTextNode(top + ' '), document.createElement('br'), document.createTextNode(bottom));
    }

    btn?.addEventListener('click', async ()=>{
      boxErr.classList.add('hidden');
      boxResult.classList.add('hidden');
      boxEmpty.classList.add('hidden');

      const code = input.value.trim();
      const data = await lookupBookingByCode(code);
      if (!data){
        boxErr.classList.remove('hidden');
        return;
      }

      // Preenche resultado
      $('#lrCode').textContent = data.code;
      $('#lrVehicle').textContent = data.vehicle || '—';
      setBr($('#lrPickup'), `${data.pickupDate} - ${data.pickupTime}`, data.pickupLocation || '—');
      setBr($('#lrDropoff'), `${data.dropoffDate} - ${data.dropoffTime}`, data.dropoffLocation || '—');
      $('#lrExtras').textContent = data.extras || '—';
      $('#lrDays').textContent = data.days || '—';
      $('#lrTotal').textContent = data.total || '—';
      $('#lrEmail').textContent = data.email || '—';

      boxResult.classList.remove('hidden');
    });
  })();

  /* === 3.E Integração: salve quando GERAR a reserva ===
     Chame persistBooking(booking) logo após gerar o objeto no seu fluxo “processado”.
 
  window.__saveBookingAfterProcessed = async function(booking){
    try { await persistBooking(booking); } catch(e){}
  };
 */

  (function(){
    const DEFAULT_LANG = 'pt';
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
      setLang(initial);

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

  // helper de formatação (opcional)
  function fmtDateYMD(d){ return flatpickr.formatDate(d, 'Y-m-d'); }
  function fmtDateBR(d){ return flatpickr.formatDate(d, 'd/m/Y'); }

  (function initHomeSearch(){
    const $ = sel => document.querySelector(sel);

    const elPUDate = document.querySelector('#searchPickupDate');
    const elDODate = document.querySelector('#searchDropoffDate');    
    const elPUTime = $('#searchPickupTime');
    const elDOTime = $('#searchDropoffTime');
    const elPickup = $('#searchPickupLoc');

    // ---- Toggle: "Outro endereço de devolução" (usa classe .has-alt no container) ----
    const addrRow = document.getElementById('addrRow');
    const btnAlt  = document.getElementById('btnAltDropInline');
    const elDropAlt = document.getElementById('searchDropoffLoc'); // para dar foco
    const dropCol = document.getElementById('dropoffCol');         // opcional: esconder/mostrar

    if (addrRow && btnAlt) {
      const isCheckbox = btnAlt.tagName === 'INPUT' && btnAlt.type === 'checkbox';

      // aplica estado visual + ARIA
      const applyAlt = (on) => {
        addrRow.classList.toggle('has-alt', !!on);

        // se também quiser garantir via classe utilitária:
        if (dropCol) dropCol.classList.toggle('hidden', !on);

        if (isCheckbox) {
          btnAlt.setAttribute('aria-checked', String(!!on));
        } else {
          btnAlt.setAttribute('aria-pressed', on ? 'true' : 'false');
          btnAlt.textContent = (typeof t === 'function'
            ? (on ? (t('search.removeOtherDropoff') || 'Remover endereço')
                  : (t('search.otherDropoffBtn')   || 'Outro endereço'))
            : (on ? 'Remover endereço' : 'Outro endereço'));
        }

        if (on) elDropAlt?.focus();
      };

      // estado inicial (se checkbox, respeita o checked)
      applyAlt(isCheckbox ? btnAlt.checked : addrRow.classList.contains('has-alt'));

      // listeners
      if (isCheckbox) {
        btnAlt.addEventListener('change', () => applyAlt(btnAlt.checked));
      } else {
        btnAlt.addEventListener('click', () => {
          const next = !addrRow.classList.contains('has-alt');
          applyAlt(next);
        });
      }
    }

    // ---- Time pickers ----
    flatpickr(elPUTime, { enableTime:true, noCalendar:true, dateFormat:'H:i', time_24hr:true, defaultDate:'09:00' });
    flatpickr(elDOTime, { enableTime:true, noCalendar:true, dateFormat:'H:i', time_24hr:true, defaultDate:'18:00' });

    // ---- UM calendário range no pickup, linkado ao dropoff (robusto em mobile) ----
    elPUDate?._flatpickr?.destroy();
    elDODate?._flatpickr?.destroy();

    const fpDates = flatpickr(elPUDate, {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'Y-m-d',   // simples e consistente
      disableMobile: true,   // evita picker nativo
      static: true,          // evita fechar por blur
      closeOnSelect: false,  // mantém aberto após a 1ª data
      allowInput: false,
      clickOpens: true,
      plugins: [ new rangePlugin({ input: elDODate }) ],
      // ⚠️ Workaround: ao escolher a SEGUNDA data, garantimos os dois valores
      onChange(selectedDates, _str, fp) {
        if (selectedDates.length === 2) {
          const [start, end] = selectedDates;
          // força o estado do range dentro do flatpickr (alguns mobiles “esquecem” a 1ª)
          fp.setDate([start, end], false); // false = não dispara onChange de novo
          // e garante que cada input exiba o seu valor correto:
          elPUDate.value = flatpickr.formatDate(start, 'Y-m-d');
          elDODate.value = flatpickr.formatDate(end,   'Y-m-d');
          // opcional: feche depois da 2ª seleção
          fp.close();
        }
      },
      // se fechar com apenas 1 data selecionada, reabra para permitir escolher a 2ª
      onClose(selectedDates, _str, fp) {
        if (selectedDates.length === 1) setTimeout(() => fp.open(), 0);
      }
    });

    // ✅ Pré-seleção hoje → amanhã sem usar defaultDate
    {
      const today = new Date();
      const s = new Date(today.getFullYear(), today.getMonth(), today.getDate());      // 00:00 local
      const e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1);             // +1 dia
      elPUDate.value = flatpickr.formatDate(s, 'Y-m-d');
      elDODate.value = flatpickr.formatDate(e, 'Y-m-d');
    }
    
    // abrir o MESMO calendário ao focar/clicar em QUALQUER input
    [elPUDate, elDODate].forEach(el => {
      el?.addEventListener('focus', () => fpDates.open());
      el?.addEventListener('click',  () => fpDates.open());
    });

  })();

function perDayLabel(){
  return t('fleet.perDay') || (document.documentElement.lang?.startsWith('en') ? 'day' : 'diária');
}


// Carrega frota
async function loadFleet(){
  const r = await fetch('assets/data/fleet.json', { cache:'no-store' });
  return r.ok ? r.json() : [];
}

// Sidebar: abrir/fechar no mobile
const filtersPanel = document.getElementById('filtersPanel');
const closeBtn = document.getElementById('closeFiltersBtn');

if (closeBtn) closeBtn.addEventListener('click', () => {
  location.reload();
});

document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);

const appState = {
  // parâmetros da busca/filtros
  model: '', seats: 0, luggage: 0, sort: '',
  // dados
  fleet: [], filtered: []
};

// Persistência simples
function saveState(){ sessionStorage.setItem('mlc_state', JSON.stringify(appState)); }
function loadState(){
  const raw = sessionStorage.getItem('mlc_state');
  if (!raw) return;
  try { Object.assign(appState, JSON.parse(raw)); } catch {}
}

// Router
function showView(name){
  const home = document.getElementById('view-home');
  const results = document.getElementById('view-results');
  const isResults = (name === 'results');

  home.classList.toggle('hidden', isResults);
  results.classList.toggle('hidden', !isResults);

  if (isResults) {
    // sincroniza UI dos filtros com appState
    syncFiltersFromState();
    renderResults(); // aplica filtros e renderiza grid
  }
}

// Navegação pelo hash
function getRoute(){ return (location.hash || '#home').slice(1); }
window.addEventListener('hashchange', ()=>showView(getRoute()));
document.addEventListener('DOMContentLoaded', ()=>{
  loadState();
  showView(getRoute());
});

document.getElementById('searchForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1) Só valida ENDEREÇO de retirada
  const puLocEl = document.getElementById('searchPickupLoc');
  const puLoc   = puLocEl?.value?.trim() || '';
  if (!puLoc) {
    i18nAlert('alerts.pickupAddressRequired', 'Informe o endereço de retirada.');
    puLocEl?.focus();
    return;
  }

  // 2) Datas: lê DIRETO dos inputs (já estão em ISO Y-m-d)
  const puDateYMD = document.getElementById('searchPickupDate')?.value || '';
  const doDateYMD = document.getElementById('searchDropoffDate')?.value || '';

  // 3) Dias (mínimo 1 diária)
  //const days = Math.max(1, Math.ceil((end - start) / 86400000));

  const days = Math.max(
    1,
    Math.ceil((new Date(doDateYMD) - new Date(puDateYMD)) / 86400000)
  );

  // 4) Horas e locais (sem mudanças)
  const puTime = document.getElementById('searchPickupTime')?.value || '';
  const doTime = document.getElementById('searchDropoffTime')?.value || '';
  const doLoc   = document.getElementById('searchDropoffLoc')?.value?.trim() || puLoc;

  // 5) Estado da busca — mantemos os mesmos nomes que o resto do código espera
  //    (puDateBR/doDateBR = iguais ao ISO pra não quebrar nada visual; você disse que pode ser em inglês mesmo)
  appState.search = {
    viaSearch: true,
    puDateYMD, doDateYMD,
    puDateBR: puDateYMD,   // simplificado: usa ISO também
    doDateBR: doDateYMD,   // simplificado: usa ISO também
    puTime, doTime, puLoc, doLoc,
    days
  };

  // 6) Carrega frota se necessário e navega
  if (!appState.fleet.length) appState.fleet = await loadFleet();
  appState.model = ''; appState.seats = 0; appState.luggage = 0; appState.sort = '';
  saveState();
  location.hash = '#results';
});

function syncFiltersFromState(){
  document.getElementById('fModel').value    = appState.model || '';
  document.getElementById('fSeats').value    = appState.seats || '';
  document.getElementById('fLuggage').value  = appState.luggage || '';
  document.getElementById('fPrice').value    = appState.sort || '';
  const d = document.getElementById('fPriceDesktop'); if (d) d.value = appState.sort || '';
}

function captureFiltersToState(){
  appState.seats   = parseInt(document.getElementById('fSeats').value || '0', 10);
  appState.luggage = parseInt(document.getElementById('fLuggage').value || '0', 10);
}

function applyFilters(list) {
  const selectedCategories = appState.selectedCategories || [];
  const seats = appState.seats || 0;
  const luggage = appState.luggage || 0;

  let out = list.filter(car => {
    // Filtro por categoria: se nenhuma selecionada, mostra todas
    const okCategory = selectedCategories.length === 0 || selectedCategories.includes(car.class);
    const okSeats = !seats || car.seats >= seats;
    const okLuggage = !luggage || car.luggage >= luggage;

    return okCategory && okSeats && okLuggage;
  });

  // Ordenação
  if (appState.sort === 'asc') out.sort((a,b) => a.pricePerDay - b.pricePerDay);
  if (appState.sort === 'desc') out.sort((a,b) => b.pricePerDay - a.pricePerDay);

  return out;
}

function clearAllFilters() {
  // Limpar checkboxes de categoria
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Limpar outros filtros
  document.getElementById('fSeats').value = '';
  document.getElementById('fLuggage').value = '';

  const s1 = document.getElementById('fPrice');
  const s2 = document.getElementById('fPriceDesktop');
  if (s1) s1.value = '';
  if (s2) s2.value = '';

  // Resetar estado
  appState.model = '';
  appState.seats = 0;
  appState.luggage = 0;
  appState.sort = '';
  appState.selectedCategories = [];

  renderResults();
}

function renderResults(){
  appState.filtered = applyFilters(appState.fleet);
  renderGrid(appState.filtered);
  renderCounters(appState.filtered.length);
  renderChips(); // opcional
  saveState();
}

function renderCounters(n){
  const text = `${n} ${t('results.vehicles') || 'veículos'}`;
  document.getElementById('resultsCounterInline').textContent = text;
}


['fPrice','fPriceDesktop'].forEach(id=>{
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('change', (e)=>{
    appState.sort = e.target.value || '';
    const other = id==='fPrice' ? 'fPriceDesktop' : 'fPrice';
    const el2 = document.getElementById(other); if (el2) el2.value = appState.sort;
    renderResults();
  });
});

document.getElementById('applyFilters')?.addEventListener('click', ()=>{
  captureFiltersToState(); renderResults();
});

// 6. INICIALIZAR O FILTRO DE CATEGORIAS
async function initializeCategoryFilter() {
  // Carregar frota se necessário
  if (!appState.fleet || appState.fleet.length === 0) {
    try {
      const response = await fetch('assets/data/fleet.json', { cache: 'no-store' });
      appState.fleet = response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Erro ao carregar frota:', error);
      appState.fleet = [];
    }
  }

  // Extrair categorias únicas
  const categories = getUniqueCategories(appState.fleet);

  // Renderizar filtro de categorias
  renderCategoryFilter(categories);

  console.log('Filtro de categorias inicializado com:', categories);
}


function renderGrid(list){
  const root = document.getElementById('resultsList');
  root.innerHTML = '';
  const pd = perDayLabel();

  if (!list.length){
    root.innerHTML = `<div class="col-span-full text-center p-10 bg-white rounded-xl border">
      <p class="text-slate-600" data-i18n="results.empty">Nenhum carro encontrado com esses filtros.</p>
    </div>`;
    return;
  }

  list.forEach(c=>{

    const perDay = Number(c.pricePerDay ?? c.price ?? 0);
    const days   = Number(appState?.search?.days || 0);
    const total  = days ? (perDay * days) : perDay;
    const suffix = days
      ? ` / ${days} ${t('fb.summary.days') || 'diárias'}`
      : `/<span data-i18n="fleet.perDay">${escapeHtml(perDayLabel())}</span>`;
    
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow';
    card.innerHTML = `
      <div class="relative h-44">
        <img src="${c.image}" alt="${c.model}" class="w-full h-full object-cover"
             onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"/>
        <div class="hidden absolute inset-0 bg-gray-200 animate-pulse"></div>
        <div class="absolute top-3 left-3 px-2 py-1 text-xs rounded-full gold-bg navy-text font-semibold shadow">
          ${c.class || 'Premium'}
        </div>
      </div>
      <div class="p-4">
        <h2 class="font-semibold text-lg">${c.model}</h2>
        <p class="text-sm text-gray-600">
          ${c.seats} <span data-i18n="fleet.seats">assentos</span> · 
          ${c.luggage} <span data-i18n="fleet.luggage">malas</span>
        </p>
        <span class="text-2xl font-bold gold-text">
         $${Math.round(total)}<small class="text-gray-500 text-sm">${suffix}</small>
        </span>
        <button
          class="navy-bg text-white py-2 px-4 rounded hover:bg-blue-900 transition-all w-full mt-3"
          onclick="openFullBooking(this)"
          data-model="${c.model}"
          data-img="${c.image}"
          data-seats="${c.seats}"
          data-luggage="${c.luggage}"
          data-price="${c.pricePerDay}"
        >
          <span data-i18n="fleet.reserve">Reservar</span>
        </button>
      </div>`;
    root.appendChild(card);
  });

  if (typeof window.tApply === 'function' && window.__i18nDict) window.tApply(window.__i18nDict);
}

let fbInited = false;
function initFullBookingIfNeeded(){
  if (fbInited) return;
  const cal = document.querySelector('#fbDateCalendar');
  const t1  = document.querySelector('#fbPickupTime');
  const t2  = document.querySelector('#fbDropoffTime');
  if (cal) flatpickr(cal, { mode:'range', dateFormat:'Y-m-d' /* ... */ });
  if (t1)  flatpickr(t1,  { enableTime:true, noCalendar:true, dateFormat:'H:i' });
  if (t2)  flatpickr(t2,  { enableTime:true, noCalendar:true, dateFormat:'H:i' });
  fbInited = true;
}


// ---------- helpers ----------
function perDayLabel(){
  return (window.t && t('fleet.perDay')) ||
         (document.documentElement.lang?.startsWith('en') ? 'day' : 'diária');
}
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}
function normalizeCar(c){
  // mapeia/normaliza campos que podem variar no JSON
  return {
    model:   c.model ?? c.name ?? '',
    image:   c.image ?? c.img ?? c.photo ?? '',
    year:    c.years ?? c.modelYear ?? '',
    seats:   Number(c.seats ?? c.capacity ?? 0),
    luggage: Number(c.luggage ?? c.bags ?? 0),
    price:   Number(c.pricePerDay ?? c.price ?? 0),
    class:   c.class ?? c.category ?? ''
  };
}

// ---------- constrói UM slide (DOM) ----------
function buildFleetSlide(car){
  const c = normalizeCar(car);
  const pd = perDayLabel();

  // slide -> card (mantendo classes/layout do seu exemplo)
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';

  // Monta o "miolo" SEM o botão (vamos criar o botão via DOM para garantir dataset seguro)
  slide.innerHTML = `
    <div class="car-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
      <div class="relative h-48">
        <img
          src="${escapeHtml(c.image)}"
          alt="${escapeHtml(c.model)}"
          class="w-full h-full object-cover card-image"
          loading="lazy"
          onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"
        />
        <div class="hidden absolute inset-0 skeleton"></div>
      </div>
      <div class="p-4">
        <h3 class="text-xl font-bold navy-text mb-2">${escapeHtml(c.model)}</h3>
        <div class="flex justify-between text-gray-600 mb-4">
          <span><i class="fas fa-calendar-alt mr-1"></i> ${escapeHtml(c.year)}</span>
          <span><i class="fas fa-users mr-1"></i> ${c.seats} <span data-i18n="fleet.seats">lugares</span></span>
          <span><i class="fas fa-suitcase mr-1"></i> ${c.luggage} <span data-i18n="fleet.luggage">malas</span></span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold gold-text">
            $${c.price}<small class="text-gray-500 text-sm">/<span data-i18n="fleet.perDay">${escapeHtml(pd)}</span></small>
          </span>
          <span class="btn-slot"></span>
        </div>
      </div>
    </div>
  `;

  // Cria o botão exatamente como no Código 2, com inline handler e data-*:
  const btn = document.createElement('button');
  btn.className = 'navy-bg text-white py-2 px-4 rounded hover:bg-blue-900 transition-all';
  btn.setAttribute('onclick', 'openFullBooking(this)'); // mantém o padrão pedido
  btn.dataset.model   = c.model || '';
  btn.dataset.img     = c.image || '';
  btn.dataset.seats   = String(c.seats || '');
  btn.dataset.luggage = String(c.luggage || '');
  btn.dataset.price   = String(c.price || '');
  btn.innerHTML = `<span data-i18n="fleet.reserve">Reservar</span>`;

  // injeta o botão no lugar reservado
  const slot = slide.querySelector('.btn-slot');
  slot.replaceWith(btn);

  return slide;
}

// ---------- carrega JSON e renderiza no Swiper ----------
async function renderFleetSwiper({
  jsonUrl = 'assets/data/fleet.json',
  wrapperSelector = '#fleetSwiperWrapper'
} = {}){
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  // busca o JSON
  let cars = [];
  try {
    const r = await fetch(jsonUrl, { cache: 'no-store' });
    cars = r.ok ? await r.json() : [];
  } catch (e) { cars = []; }

  // limpa e popula
  wrapper.innerHTML = '';
  cars.forEach(car => wrapper.appendChild(buildFleetSlide(car)));

  // aplica i18n se existir
  if (typeof window.tApply === 'function' && window.__i18nDict) {
    window.tApply(window.__i18nDict);
  }

  // (re)inicializa/atualiza o Swiper
  if (window.__fleetSwiper) {
    window.__fleetSwiper.update();
  } else if (window.Swiper) {
    window.__fleetSwiper = new Swiper('#fleetSwiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      breakpoints: {
        640:  { slidesPerView: 2, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 20 }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }
}

// ---------- boot ----------
document.addEventListener('DOMContentLoaded', () => {
  renderFleetSwiper();
});


// Checa se o place selecionado é na Flórida
function isFlorida(place) {
  const comps = place?.address_components || [];
  const state = comps.find(c => c.types.includes('administrative_area_level_1'));
  return state && (state.short_name === 'FL' || state.long_name === 'Florida');
}

// Normaliza alguns dados úteis
function extractPlaceData(place) {
  return {
    formatted: place.formatted_address || place.name || '',
    lat: place.geometry?.location?.lat?.() ?? null,
    lng: place.geometry?.location?.lng?.() ?? null
  };
}

// ===== SOLUÇÃO SUPER SIMPLES GOOGLE PLACES =====
// Substitua toda a função realInitPlacesAutocomplete no seu script.js

window.realInitPlacesAutocomplete = async function() {

  try {
    // Importar biblioteca places
    const { Autocomplete } = await google.maps.importLibrary("places");

    // Bounds da Florida
    const FL_BOUNDS = new google.maps.LatLngBounds(
      new google.maps.LatLng(24.396308, -87.634938),
      new google.maps.LatLng(31.000968, -80.031362)
    );

    // Dicionário de tradução para termos de busca
    const searchTranslations = {
      // Português para Inglês
      'aeroporto': 'airport',
      'aeroportos': 'airports', 
      'hotel': 'hotel',
      'hoteis': 'hotels',
      'shopping': 'mall',
      'centro': 'downtown',
      'praia': 'beach',
      'praias': 'beaches',
      'parque': 'park',
      'parques': 'parks',
      'universidade': 'university',
      'hospital': 'hospital',
      'estacao': 'station',
      'estação': 'station',
      'rodoviaria': 'bus station',
      'rodoviária': 'bus station',
      'metro': 'subway',
      'metrô': 'subway',
      'disney': 'disney',
      'universal': 'universal',
      'internacional': 'international',

      // Espanhol para Inglês
      'aeropuerto': 'airport',
      'aeropuertos': 'airports',
      'centro': 'downtown',
      'playa': 'beach',
      'playas': 'beaches',
      'parque': 'park',
      'parques': 'parks',
      'universidad': 'university',
      'estacion': 'station',
      'estación': 'station',
      'metro': 'subway'
    };

    // Função para traduzir termos de busca
    const translateSearchTerms = (searchText) => {
      let translatedText = searchText.toLowerCase();

      // Substituir cada termo do dicionário
      Object.keys(searchTranslations).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        translatedText = translatedText.replace(regex, searchTranslations[term]);
      });

      return translatedText;
    };
    const css = `
      <style id="places-simple-styles">
        .pac-container {
          z-index: 99999 !important;
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          font-family: 'Inter', sans-serif !important;
        }
        .pac-item {
          padding: 12px 16px !important;
          font-size: 14px !important;
          cursor: pointer !important;
        }
        .pac-item:hover {
          background-color: #f9fafb !important;
        }
        .pac-icon { display: none !important; }

        /* FORÇA ESCONDER */
        .pac-container.hide-now {
          display: none !important;
          visibility: hidden !important;
        }
      </style>
    `;

    if (!document.getElementById('places-simple-styles')) {
      document.head.insertAdjacentHTML('beforeend', css);
    }

    // Função SIMPLES para criar autocomplete
    const createAutocomplete = (inputId) => {
      const input = document.getElementById(inputId);
      if (!input) return null;

      const autocomplete = new Autocomplete(input, {
        bounds: FL_BOUNDS,
        strictBounds: true,
        componentRestrictions: { country: 'us' },
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'address_components'],
        // MULTI-IDIOMA: aceitar termos em português, inglês e espanhol
        language: 'pt-BR' // Define português como preferência, mas aceita outros idiomas
      });

      // Interceptar digitação para traduzir termos
      input.addEventListener('input', (e) => {
        const originalValue = e.target.value;
        const translatedValue = translateSearchTerms(originalValue);

        // Se houve tradução, aplicar silenciosamente
        if (translatedValue !== originalValue.toLowerCase()) {
          // Usar setTimeout para não interferir com o evento atual
          setTimeout(() => {
            // Salvar posição do cursor
            const cursorPosition = input.selectionStart;

            // Aplicar valor traduzido
            input.value = translatedValue;

            // Restaurar posição do cursor (aproximada)
            const newPosition = Math.min(cursorPosition, translatedValue.length);
            input.setSelectionRange(newPosition, newPosition);

            // Disparar evento para o autocomplete reagir
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
          }, 10);
        }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // Verificar Florida
        const isFL = place.address_components?.some(c => 
          c.types.includes('administrative_area_level_1') && 
          (c.short_name === 'FL' || c.long_name === 'Florida')
        );

        if (!isFL) {
          input.value = '';
          // USAR i18nAlert como no resto do sistema
          i18nAlert('alerts.onlyFloridaAddress', 'Por favor, selecione um endereço na Florida');
        } else {
          input.value = place.formatted_address || '';
        }

        // ESCONDER DROPDOWN SIMPLES
        document.querySelectorAll('.pac-container').forEach(c => {
          c.classList.add('hide-now');
        });
        input.blur();
      });

      return autocomplete;
    };

    // Aplicar nos inputs
    setTimeout(() => {
      ['searchPickupLoc', 'searchDropoffLoc', 'fbPickupAddr', 'fbDropoffAddr'].forEach(id => {
        createAutocomplete(id);
      });
    }, 500);

    // LISTENER GLOBAL para cliques em qualquer pac-item
    document.addEventListener('click', (e) => {
      if (e.target.closest('.pac-item')) {
        setTimeout(() => {
          document.querySelectorAll('.pac-container').forEach(container => {
            container.classList.add('hide-now');
          });
        }, 100);
      }
    });

    // LISTENER GLOBAL para quando aparecer pac-container, remover a classe hide-now
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.pac-container.hide-now').forEach(c => {
        if (c.style.display !== 'none') {
          c.classList.remove('hide-now');
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

  } catch (error) {
    console.error('Erro:', error);
  }
};

// Função manual para esconder
window.hideDropdowns = function() {
  document.querySelectorAll('.pac-container').forEach(c => {
    c.classList.add('hide-now');
  });
};


// 2. FUNÇÃO PARA CALCULAR DISTÂNCIA DE ORLANDO (aproximada)
function isWithin30MilesOfOrlando(address) {
  if (!address || typeof address !== 'string') return true; // default: sem taxa

  const addr = address.toLowerCase();

  // Cidades dentro do raio de 30 milhas de Orlando (sem taxa)
  const orlandoArea = [
    'orlando', 'kissimmee', 'lake buena vista', 'bay lake', 'windermere',
    'winter park', 'maitland', 'altamonte springs', 'casselberry', 'longwood',
    'sanford', 'lake mary', 'apopka', 'winter garden', 'ocoee', 'pine hills',
    'dr phillips', 'hunter\'s creek', 'celebration', 'poinciana', 'davenport',
    'clermont', 'champions gate', 'reunion', 'four corners'
  ];

  // Verifica se o endereço contém alguma dessas cidades
  return orlandoArea.some(city => addr.includes(city));
}

// 3. FUNÇÃO PARA CALCULAR SE PRECISA COBRAR TAXA
function calculateLocationFee(pickupAddr, dropoffAddr) {
  const pickupWithinRange = isWithin30MilesOfOrlando(pickupAddr);
  const dropoffWithinRange = isWithin30MilesOfOrlando(dropoffAddr);

  // Se QUALQUER endereço estiver fora do raio, cobra $200
  if (!pickupWithinRange || !dropoffWithinRange) {
    return 200;
  }

  return 0;
}

// ===== IMPLEMENTAÇÃO DO FILTRO POR CATEGORIAS =====

// 1. FUNÇÃO PARA EXTRAIR CATEGORIAS ÚNICAS DOS CARROS
function getUniqueCategories(fleet) {
  const categories = new Set();
  fleet.forEach(car => {
    if (car.class) {
      categories.add(car.class);
    }
  });
  return Array.from(categories).sort(); // Retorna em ordem alfabética
}

// 2. FUNÇÃO PARA CRIAR O HTML DAS CATEGORIAS COM CHECKBOXES
function renderCategoryFilter(categories) {
  //const container = document.getElementById('fModel').parentElement;

  // Substituir o input texto por um container de checkboxes
  const categoryHTML = `
    <div id="categoryFilters" class="space-y-2">
      ${categories.map(category => `
        <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input 
            type="checkbox" 
            value="${category}" 
            class="category-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm">${category}</span>
        </label>
      `).join('')}
    </div>
  `;

  // Substituir o input por esta estrutura
  document.getElementById('fModel').outerHTML = categoryHTML;

  // Adicionar listeners aos checkboxes
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateCategoryFilter();
      renderResults(); // Aplicar filtros automaticamente
    });
  });
}

// 3. FUNÇÃO PARA ATUALIZAR O ESTADO COM CATEGORIAS SELECIONADAS
function updateCategoryFilter() {
  const selectedCategories = [];
  document.querySelectorAll('.category-checkbox:checked').forEach(checkbox => {
    selectedCategories.push(checkbox.value);
  });

  // Atualizar estado
  appState.selectedCategories = selectedCategories;

  // Para compatibilidade com o sistema atual, definir model como string das categorias
  appState.model = selectedCategories.join(',');
}


// 8. CHAMADA DE INICIALIZAÇÃO
// Adicione isso quando a view de resultados for mostrada:
function showView(name) {
  const home = document.getElementById('view-home');
  const results = document.getElementById('view-results');
  const isResults = (name === 'results');

  home.classList.toggle('hidden', isResults);
  results.classList.toggle('hidden', !isResults);

  if (isResults) {
    // Inicializar filtro de categorias se ainda não foi feito
    if (!document.getElementById('categoryFilters')) {
      initializeCategoryFilter();
    }
    renderResults();
  }
}

// 9. ATUALIZAR renderChips PARA MOSTRAR CATEGORIAS SELECIONADAS
function renderChips() {
  let wrap = document.getElementById('activeChips');

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'activeChips';
    wrap.className = 'flex flex-wrap gap-2 mb-4';

    const resultsList = document.getElementById('resultsList');
    if (resultsList && resultsList.parentNode) {
      resultsList.parentNode.insertBefore(wrap, resultsList);
    }
  }

  wrap.innerHTML = '';
  const chips = [];

  // Chips para categorias selecionadas
  if (appState.selectedCategories && appState.selectedCategories.length > 0) {
    appState.selectedCategories.forEach(category => {
      chips.push({k:'category', value: category, label: category});
    });
  }

  // Outros chips
  if (appState.seats) chips.push({k:'seats', label: (t('fleet.seats')||'assentos')+': '+appState.seats+'+'});
  if (appState.luggage) chips.push({k:'luggage', label: (t('fleet.luggage')||'malas')+': '+appState.luggage+'+'});
  if (appState.sort) chips.push({k:'sort', label: (t('filters.price')||'Preço')+': '+(appState.sort==='asc'?(t('filters.lowToHigh')||'Menor→Maior'):(t('filters.highToLow')||'Maior→Menor'))});

  chips.forEach(c => {
    const b = document.createElement('button');
    b.className = 'text-sm px-3 py-1 rounded-full border bg-white hover:bg-slate-50 flex items-center gap-2';
    b.innerHTML = `<span>${c.label}</span><i class="fa-solid fa-xmark"></i>`;
    b.addEventListener('click', () => {
      if (c.k === 'category') {
        // Desmarcar checkbox específico
        const checkbox = document.querySelector(`.category-checkbox[value="${c.value}"]`);
        if (checkbox) checkbox.checked = false;
        updateCategoryFilter();
      }
      if (c.k === 'seats') { 
        appState.seats = 0; 
        document.getElementById('fSeats').value = ''; 
      }
      if (c.k === 'luggage') { 
        appState.luggage = 0; 
        document.getElementById('fLuggage').value = ''; 
      }
      if (c.k === 'sort') { 
        appState.sort = ''; 
        const s1 = document.getElementById('fPrice');
        const s2 = document.getElementById('fPriceDesktop');
        if (s1) s1.value = '';
        if (s2) s2.value = '';
      }
      renderResults();
    });
    wrap.appendChild(b);
  });
}


// ====== SISTEMA DE EMAIL MYLUXCARS ======

// Configuração do EmailJS (recomendado - gratuito até 200 emails/mês)
const EMAIL_CONFIG = {
  get EMAILJS_PUBLIC_KEY() { return CONFIG.EMAILJS_KEY; },
  get SERVICE_ID() { return CONFIG.SERVICE_ID; },
  get ADMIN_TEMPLATE_ID() { return CONFIG.ADMIN_TEMPLATE_ID; },
  get CLIENT_TEMPLATE_ID() { return CONFIG.CLIENT_TEMPLATE_ID; }
};

// Templates de email por idioma
const EMAIL_TEMPLATES = {
  pt: {
    subject: 'Confirmação de Reserva - MyLuxCars',
    title: 'Sua reserva foi confirmada!',
    greeting: 'Parabéns',
    intro: 'Estamos muito felizes em confirmar sua reserva de veículo premium conosco. Prepare-se para uma experiência inesquecível dirigindo pelas estradas da Flórida!',
    bookingDetails: 'Detalhes da sua reserva',
    importantInfo: 'Informações importantes',
    usaRentalTips: [
      'Leve sua CNH brasileira + PID (Permissão Internacional para Dirigir)',
      'Tanque deve ser devolvido com o mesmo nível de combustível',
      'Respeite os limites de velocidade (geralmente 55-70 mph)',
      'Estacionamento é gratuito na maioria dos hotéis e shoppings',
      'Pedágios são automáticos com nosso SunPass incluso'
    ],
    contactInfo: 'Qualquer dúvida, estamos aqui para ajudar',
    footer: 'Desejamos uma viagem incrível! Equipe MyLuxCars'
  },
  en: {
    subject: 'Booking Confirmation - MyLuxCars',
    title: 'Your reservation is confirmed!',
    greeting: 'Congratulations',
    intro: 'We are thrilled to confirm your premium vehicle reservation with us. Get ready for an unforgettable experience driving through Florida\'s roads!',
    bookingDetails: 'Your booking details',
    importantInfo: 'Important information',
    usaRentalTips: [
      'Bring your driver\'s license + International Driving Permit (IDP)',
      'Return the tank with the same fuel level as pickup',
      'Respect speed limits (usually 55-70 mph)',
      'Parking is free at most hotels and shopping centers',
      'Tolls are automatic with our included SunPass'
    ],
    contactInfo: 'If you have any questions, we\'re here to help',
    footer: 'We wish you an amazing trip! MyLuxCars Team'
  },
  es: {
    subject: 'Confirmación de Reserva - MyLuxCars',
    title: '¡Tu reserva está confirmada!',
    greeting: 'Felicitaciones',
    intro: 'Estamos muy emocionados de confirmar tu reserva de vehículo premium con nosotros. ¡Prepárate para una experiencia inolvidable conduciendo por las carreteras de Florida!',
    bookingDetails: 'Detalles de tu reserva',
    importantInfo: 'Información importante',
    usaRentalTips: [
      'Lleva tu licencia de conducir + PIC (Permiso Internacional de Conducir)',
      'El tanque debe devolverse con el mismo nivel de combustible',
      'Respeta los límites de velocidad (generalmente 55-70 mph)',
      'El estacionamiento es gratuito en la mayoría de hoteles y centros comerciales',
      'Los peajes son automáticos con nuestro SunPass incluido'
    ],
    contactInfo: 'Si tienes alguna pregunta, estamos aquí para ayudarte',
    footer: '¡Te deseamos un viaje increíble! Equipo MyLuxCars'
  }
};

// Função para detectar idioma atual
function getCurrentLanguage() {
  return window.__i18nDict?.__meta?.lang || 'pt';
}

// Função para formatar dados da reserva para email
function formatBookingForEmail(booking) {
  const lang = getCurrentLanguage();
  const template = EMAIL_TEMPLATES[lang];

  return {
    // Dados básicos
    code: booking.code,
    vehicle: booking.vehicle,
    customerName: booking.fullName,
    customerEmail: booking.email,

    // Datas formatadas
    pickupDateTime: `${formatDateForEmail(booking.pickupDate)} às ${booking.pickupTime}`,
    dropoffDateTime: `${formatDateForEmail(booking.dropoffDate)} às ${booking.dropoffTime}`,

    // Locais
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,

    // Valores
    days: booking.days,
    total: `$${booking.total}`,
    subtotal: `$${booking.subtotal || '0'}`,
    locationFee: booking.locationFee > 0 ? `$${booking.locationFee}` : 'Incluído',

    // CORREÇÃO: Garantir que os textos do template sejam enviados
    subject: template.subject,
    title: template.title,
    greeting: template.greeting,
    intro: template.intro,
    bookingDetails: template.bookingDetails,
    importantInfo: template.importantInfo,
    contactInfo: template.contactInfo,
    footer: template.footer,

    // Dicas formatadas
    usaRentalTips: template.usaRentalTips.map(tip => `• ${tip}`).join('\n'),

    // Idioma
    language: lang
  };
}

// Função para formatar data para email
function formatDateForEmail(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const lang = getCurrentLanguage();

  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  const locale = {
    pt: 'pt-BR',
    en: 'en-US', 
    es: 'es-ES'
  }[lang] || 'pt-BR';

  return date.toLocaleDateString(locale, options);
}

// Função principal para enviar emails
async function sendBookingEmails(booking) {
  console.log('📧 Enviando emails de confirmação...');

  try {
    // Formatar dados para os templates
    const emailData = formatBookingForEmail(booking);

    // 1. Enviar email para o ADMIN
    const adminEmailResult = await sendAdminEmail(emailData);

    // 2. Enviar email para o CLIENTE
    const clientEmailResult = await sendClientEmail(emailData);

    console.log('✅ Emails enviados:', {
      admin: adminEmailResult.success,
      client: clientEmailResult.success
    });

    return {
      success: true,
      admin: adminEmailResult,
      client: clientEmailResult
    };

  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Email para administrador (simples, só dados)
async function sendAdminEmail(data) {
  const adminTemplate = {
    to_email: 'david@myluxcars.com',
    to_name: 'David - MyLuxCars',
    subject: `Nova Reserva: ${data.code} - ${data.vehicle}`,

    // Dados da reserva para o template
    booking_code: data.code,
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    vehicle: data.vehicle,
    pickup_datetime: data.pickupDateTime,
    pickup_location: data.pickupLocation,
    dropoff_datetime: data.dropoffDateTime,
    dropoff_location: data.dropoffLocation,
    days: data.days,
    total: data.total
  };

  return await sendEmailViaService(EMAIL_CONFIG.ADMIN_TEMPLATE_ID, adminTemplate);
}

async function sendClientEmail(data) {
  const clientTemplate = {
    to_email: data.customerEmail,
    to_name: data.customerName,
    subject: data.subject,

    // Dados básicos da reserva
    booking_code: data.code,
    customer_name: data.customerName,
    vehicle: data.vehicle,
    pickup_datetime: data.pickupDateTime,
    pickup_location: data.pickupLocation,
    dropoff_datetime: data.dropoffDateTime,
    dropoff_location: data.dropoffLocation,
    days: data.days,
    total: data.total,
    subtotal: data.subtotal,
    location_fee: data.locationFee,

    // ADICIONAR: Textos formatados que estavam faltando
    title: data.title,
    greeting: data.greeting,
    intro: data.intro,
    booking_details: data.bookingDetails,
    important_info: data.importantInfo,
    rental_tips: data.usaRentalTips,
    contact_info: data.contactInfo,
    footer: data.footer
  };

  return await sendEmailViaService(EMAIL_CONFIG.CLIENT_TEMPLATE_ID, clientTemplate);
}

// Função genérica para enviar email via EmailJS
async function sendEmailViaService(templateId, templateParams) {
  try {
    // Verificar se EmailJS está carregado
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS não carregado');
    }

    console.log('DEBUG - SERVICE_ID:', EMAIL_CONFIG.SERVICE_ID);
    console.log('DEBUG - templateId:', templateId);
    console.log('DEBUG - templateParams:', templateParams);
    console.log('DEBUG - EMAILJS_PUBLIC_KEY:', EMAIL_CONFIG.EMAILJS_PUBLIC_KEY);

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      templateId,
      templateParams,
      EMAIL_CONFIG.EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true, messageId: response.text };
    } else {
      throw new Error(`Falha no envio: ${response.status}`);
    }

  } catch (error) {
    console.error('Erro no serviço de email:', error);
    return { success: false, error: error.message };
  }
}


// Função para carregar EmailJS dinamicamente
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (typeof emailjs !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init(EMAIL_CONFIG.EMAILJS_PUBLIC_KEY);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Inicializar EmailJS quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
  loadEmailJS().catch(error => {
    console.warn('⚠️ Falha ao carregar EmailJS:', error);
  });
});


// ====== SISTEMA GOOGLE LOGIN - MYLUXCARS ======

// Configuração do Google Sign-In
const GOOGLE_CONFIG = {
  CLIENT_ID: '647885328486-2u09ngh1kerj5kh34lopel5ubmsiqfi0.apps.googleusercontent.com'
};

// Estado do usuário logado
let currentUser = null;

// Inicializar Google Sign-In quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
  initializeGoogleSignIn();
  checkExistingLogin();
});

// Função para inicializar Google Sign-In
function initializeGoogleSignIn() {
  // Verificar se o script do Google foi carregado
  if (typeof google === 'undefined') {
    console.warn('Google Sign-In script não carregado');
    return;
  }

  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    console.log('Google Sign-In inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Google Sign-In:', error);
  }
}

// Callback quando usuário faz login com Google
function handleGoogleLogin(response) {
  try {
    // Decodificar o JWT token do Google
    const userData = parseJwt(response.credential);

    console.log('Login Google bem-sucedido:', userData);

    // Salvar dados do usuário
    currentUser = {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      loginTime: new Date().toISOString()
    };

    // Salvar no localStorage para manter login
    localStorage.setItem('myluxcars_user', JSON.stringify(currentUser));

    // Atualizar interface
    updateUIAfterLogin();

    // Pré-preencher formulários se estiverem abertos
    prefillUserData();

    console.log('Usuário logado:', currentUser);

  } catch (error) {
    console.error('Erro no login Google:', error);
    showLoginError();
  }
}

// Função para decodificar JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Verificar se usuário já está logado (localStorage)
function checkExistingLogin() {
  const savedUser = localStorage.getItem('myluxcars_user');

  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);

      // Verificar se login não expirou (24 horas)
      const loginTime = new Date(currentUser.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        console.log('Usuário já logado:', currentUser);
        updateUIAfterLogin();
      } else {
        // Login expirado
        logout();
      }
    } catch (error) {
      console.error('Erro ao verificar login existente:', error);
      localStorage.removeItem('myluxcars_user');
    }
  }
}

// Atualizar interface após login
function updateUIAfterLogin() {
  // Mostrar informações do usuário na navbar
  updateNavbarUser();

  // Esconder botões de login
  hideLoginButtons();

  // Mostrar botão de logout
  showLogoutButton();
}

// Atualizar navbar com dados do usuário
function updateNavbarUser() {
  // Procurar local para mostrar usuário logado
  const navbar = document.querySelector('nav');

  // Remover display anterior se existir
  const existingUserDisplay = document.getElementById('userDisplay');
  if (existingUserDisplay) {
    existingUserDisplay.remove();
  }

  // Criar display do usuário
  const userDisplay = document.createElement('div');
  userDisplay.id = 'userDisplay';
  userDisplay.className = 'hidden md:flex items-center gap-3 text-white';
  userDisplay.innerHTML = `
    <img src="${currentUser.picture}" alt="${currentUser.name}" 
         class="w-8 h-8 rounded-full border-2 border-white/20">
    <span class="text-sm">Olá, ${currentUser.name.split(' ')[0]}</span>
    <button onclick="logout()" 
            class="text-xs text-white/80 hover:text-white border border-white/20 px-2 py-1 rounded">
      Sair
    </button>
  `;

  // Inserir na navbar
  const langSwitcher = document.getElementById('langSwitcher');
  if (langSwitcher) {
    langSwitcher.parentNode.insertBefore(userDisplay, langSwitcher);
  }
}

// Esconder botões de login
function hideLoginButtons() {
  const loginButtons = document.querySelectorAll('.google-login-btn');
  loginButtons.forEach(btn => btn.style.display = 'none');
}

// Mostrar botão de logout
function showLogoutButton() {
  // Implementado na updateNavbarUser()
}

// Função de logout
function logout() {
  // Limpar dados locais
  currentUser = null;
  localStorage.removeItem('myluxcars_user');

  // Revogar token do Google
  if (typeof google !== 'undefined') {
    google.accounts.id.disableAutoSelect();
  }

  // Atualizar interface
  updateUIAfterLogout();

  console.log('Usuário deslogado');
}

// Atualizar interface após logout
function updateUIAfterLogout() {
  // Remover display do usuário
  const userDisplay = document.getElementById('userDisplay');
  if (userDisplay) {
    userDisplay.remove();
  }

  // Mostrar botões de login novamente
  const loginButtons = document.querySelectorAll('.google-login-btn');
  loginButtons.forEach(btn => btn.style.display = 'block');
}

// Pré-preencher dados do usuário nos formulários
function prefillUserData() {
  if (!currentUser) return;

  // Preencher formulário de reserva se estiver aberto
  const driverNameField = document.getElementById('fbDriverName');
  const driverEmailField = document.getElementById('fbDriverEmailForm');

  if (driverNameField && !driverNameField.value) {
    driverNameField.value = currentUser.name;
  }

  if (driverEmailField && !driverEmailField.value) {
    driverEmailField.value = currentUser.email;
  }

  // Também preencher campos básicos se existirem
  const basicEmailField = document.getElementById('fbEmail');
  if (basicEmailField && !basicEmailField.value) {
    basicEmailField.value = currentUser.email;
  }
}

// Criar botão de login com Google
function createGoogleLoginButton(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Container não encontrado:', containerId);
    return;
  }

  // Verificar se Google está disponível
  if (typeof google === 'undefined') {
    container.innerHTML = `
      <div class="text-sm text-gray-500">Google indisponível</div>
    `;
    return;
  }

  // Criar botão customizado
  const customButton = document.createElement('button');
  customButton.type = 'button';
  customButton.className = 'flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm';

  customButton.innerHTML = `
    <!-- Ícone do Google -->
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span>Google Login</span>
  `;

  // Adicionar evento de clique
  customButton.addEventListener('click', function() {
    // Primeiro inicializar o Google com client_id
    google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Depois acionar o login
    google.accounts.id.prompt();
  });

  // Limpar container e adicionar botão
  container.innerHTML = '';
  container.appendChild(customButton);
}


// Função para mostrar erro de login
function showLoginError() {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
  errorMessage.innerHTML = `
    <span class="block sm:inline">Erro ao fazer login com Google. Tente novamente.</span>
    <button onclick="this.parentElement.remove()" class="ml-2 font-bold">×</button>
  `;

  document.body.appendChild(errorMessage);

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.remove();
    }
  }, 5000);
}

// Função para obter dados do usuário atual
function getCurrentUser() {
  return currentUser;
}

// Função para verificar se usuário está logado
function isUserLoggedIn() {
  return currentUser !== null;
}

// Modificar collectBookingFromUI para incluir dados do Google
function collectBookingFromUIWithGoogleUser() {
  const booking = collectBookingFromUI(); // Função original

  // Se usuário estiver logado, usar dados do Google
  if (currentUser) {
    booking.fullName = booking.fullName || currentUser.name;
    booking.email = booking.email || currentUser.email;
    booking.googleUserId = currentUser.id;
  }

  return booking;
}

// Integrar Google Login com modal de reserva
function integrateGoogleLoginWithBooking() {
  // Quando abrir modal de reserva, verificar se usuário está logado
  const originalOpenFullBooking = window.openFullBooking;

  window.openFullBooking = function(btn) {
    // Chamar função original
    originalOpenFullBooking.call(this, btn);

    // Após abrir modal, pré-preencher se usuário logado
    setTimeout(() => {
      prefillUserData();
    }, 100);
  };
}

// Inicializar integração quando documento carregar
document.addEventListener('DOMContentLoaded', function() {
  // Integrar com sistema de reservas
  integrateGoogleLoginWithBooking();
});
