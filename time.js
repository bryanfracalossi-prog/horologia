'use strict';

/* ============================================================
   Horologia — Horários pelo mundo e modo de acerto
   Usa apenas o relógio do aparelho e as regras de fuso do navegador.
   ============================================================ */

const TIME_ZONES = [
  { zone: 'America/Sao_Paulo', city: 'Brasília', country: 'Brasil' },
  { zone: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina' },
  { zone: 'America/New_York', city: 'Nova York', country: 'Estados Unidos' },
  { zone: 'America/Los_Angeles', city: 'Los Angeles', country: 'Estados Unidos' },
  { zone: 'America/Mexico_City', city: 'Cidade do México', country: 'México' },
  { zone: 'Europe/Lisbon', city: 'Lisboa', country: 'Portugal' },
  { zone: 'Europe/London', city: 'Londres', country: 'Reino Unido' },
  { zone: 'Europe/Paris', city: 'Paris', country: 'França' },
  { zone: 'Europe/Zurich', city: 'Zurique', country: 'Suíça' },
  { zone: 'Asia/Dubai', city: 'Dubai', country: 'Emirados Árabes' },
  { zone: 'Asia/Tokyo', city: 'Tóquio', country: 'Japão' },
  { zone: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'China' },
  { zone: 'Australia/Sydney', city: 'Sydney', country: 'Austrália' },
  { zone: 'Pacific/Auckland', city: 'Auckland', country: 'Nova Zelândia' }
];

const TIME_BRASILIA = 'America/Sao_Paulo';
const TIME_FORMATTERS = new Map();

let timeTicker = null;
let timeSelectedZone = TIME_BRASILIA;
let timeSyncMode = false;
let timeLastSecond = -1;
let timeLastZone = '';

function timeGetFormatter(key, zone, options) {
  const cacheKey = `${key}:${zone}`;
  if (!TIME_FORMATTERS.has(cacheKey)) {
    TIME_FORMATTERS.set(cacheKey, new Intl.DateTimeFormat(options.locale || 'en-GB', {
      ...options,
      timeZone: zone
    }));
  }
  return TIME_FORMATTERS.get(cacheKey);
}

function timeParts(zone, date = new Date()) {
  const parts = timeGetFormatter('time', zone, {
    locale: 'en-GB',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const get = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  let hour = get('hour');
  if (hour === 24) hour = 0;
  return { h: hour, m: get('minute'), s: get('second') };
}

function timePad(value) {
  return String(Math.max(0, Number(value) || 0)).padStart(2, '0');
}

function timeString(zone, withSeconds = true, date = new Date()) {
  const parts = timeParts(zone, date);
  return withSeconds
    ? `${timePad(parts.h)}:${timePad(parts.m)}:${timePad(parts.s)}`
    : `${timePad(parts.h)}:${timePad(parts.m)}`;
}

function timeDateString(zone, date = new Date()) {
  const text = timeGetFormatter('date', zone, {
    locale: 'pt-BR',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
  return text.replace(/^./, (letter) => letter.toUpperCase());
}

function timeOffsetMinutes(zone, date = new Date()) {
  const parts = timeGetFormatter('offset', zone, {
    locale: 'en-US',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(date);
  const get = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  let hour = get('hour');
  if (hour === 24) hour = 0;
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'));
  return Math.round((asUTC - date.getTime()) / 60000);
}

function timeOffsetLabel(minutes) {
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const rest = abs % 60;
  return `UTC${sign}${hours}${rest ? `:${timePad(rest)}` : ''}`;
}

function timeDiffMinutes(zone, date = new Date()) {
  return timeOffsetMinutes(zone, date) - timeOffsetMinutes(TIME_BRASILIA, date);
}

function timeDiffShort(zone, date = new Date()) {
  const diff = timeDiffMinutes(zone, date);
  if (diff === 0) return '0h';
  const sign = diff > 0 ? '+' : '−';
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 60);
  const rest = abs % 60;
  return `${sign}${hours}h${rest ? timePad(rest) : ''}`;
}

function timeDiffLabel(zone, date = new Date()) {
  const diff = timeDiffMinutes(zone, date);
  if (diff === 0) return 'mesmo horário de Brasília';
  const sign = diff > 0 ? '+' : '−';
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 60);
  const rest = abs % 60;
  return `${sign}${hours}h${rest ? timePad(rest) : ''} em relação a Brasília`;
}

function timeDateKey(zone, date = new Date()) {
  const parts = timeGetFormatter('date-key', zone, {
    locale: 'en-CA',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || '00';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function timeDayDiff(zone, baseZone, date = new Date()) {
  const zoneDay = Date.parse(`${timeDateKey(zone, date)}T00:00:00Z`);
  const baseDay = Date.parse(`${timeDateKey(baseZone, date)}T00:00:00Z`);
  return Math.round((zoneDay - baseDay) / 86400000);
}

function timeDayLabel(diff) {
  if (diff === 1) return 'amanhã';
  if (diff === -1) return 'ontem';
  return '';
}

function timeZoneInfo(zone) {
  return TIME_ZONES.find((item) => item.zone === zone) || TIME_ZONES[0];
}

function timeZoneOptionsHtml() {
  return TIME_ZONES.map((item) => (
    `<option value="${esc(item.zone)}">${esc(item.city)} · ${esc(item.country)}</option>`
  )).join('');
}

function renderTimeView() {
  const select = $('#time-zone-select');
  if (select) {
    select.innerHTML = timeZoneOptionsHtml();
    select.value = timeSelectedZone;
  }

  const grid = $('#time-world-grid');
  if (grid) {
    grid.innerHTML = TIME_ZONES.map((item) => `
      <button class="time-world-card${item.zone === timeSelectedZone ? ' is-selected' : ''}" type="button" data-time-zone="${esc(item.zone)}">
        <span class="time-world-card-head">
          <span class="time-world-city">${esc(item.city)}</span>
          <span class="time-world-country">${esc(item.country)}</span>
        </span>
        <strong class="time-world-time" data-clock-time="${esc(item.zone)}">--:--:--</strong>
        <span class="time-world-meta">
          <span class="time-world-diff" data-clock-diff="${esc(item.zone)}">—</span>
          <span class="time-world-day" data-clock-day="${esc(item.zone)}"></span>
        </span>
      </button>
    `).join('');
  }

  const count = $('#time-count');
  if (count) count.textContent = `${TIME_ZONES.length} fusos`;

  updateTimeView(true);
}

function updateTimeView(force = false) {
  if (!document.querySelector('#time-view')) return;

  const now = new Date();
  const zone = timeSelectedZone;
  const parts = timeParts(zone, now);

  if (!force && zone === timeLastZone && parts.s === timeLastSecond) return;

  timeLastZone = zone;
  timeLastSecond = parts.s;

  const info = timeZoneInfo(zone);
  const clock = timeString(zone, true, now);
  const big = $('#time-big');
  if (big) big.textContent = clock;

  const syncClock = $('#time-sync-clock');
  if (syncClock) syncClock.textContent = clock;

  const label = $('#time-label');
  if (label) label.textContent = zone === TIME_BRASILIA ? 'Horário de Brasília' : `Horário em ${info.city}`;

  const date = $('#time-date');
  if (date) date.textContent = timeDateString(zone, now);

  const offset = $('#time-offset');
  if (offset) offset.textContent = `${timeOffsetLabel(timeOffsetMinutes(zone, now))} · ${timeDiffLabel(zone, now)}`;

  const note = $('#time-zone-note');
  if (note) note.textContent = zone === TIME_BRASILIA
    ? 'Brasília, Brasil · America/Sao_Paulo'
    : `${info.city}, ${info.country} · ${info.zone}`;

  const syncZone = $('#time-sync-zone');
  if (syncZone) syncZone.textContent = zone === TIME_BRASILIA ? 'Brasília' : `${info.city}, ${info.country}`;

  const select = $('#time-zone-select');
  if (select && select.value !== zone) select.value = zone;

  const setHand = (id, degrees) => {
    const hand = document.getElementById(id);
    if (hand) hand.setAttribute('transform', `rotate(${degrees} 100 100)`);
  };
  setHand('time-hand-hour', (parts.h % 12) * 30 + parts.m * 0.5);
  setHand('time-hand-minute', parts.m * 6 + parts.s * 0.1);
  setHand('time-hand-second', parts.s * 6);

  document.querySelectorAll('[data-clock-time]').forEach((element) => {
    if (!TIME_ZONES.some((item) => item.zone === element.dataset.clockTime)) return;
    element.textContent = timeString(element.dataset.clockTime, true, now);
  });

  document.querySelectorAll('[data-clock-diff]').forEach((element) => {
    if (!TIME_ZONES.some((item) => item.zone === element.dataset.clockDiff)) return;
    element.textContent = timeDiffShort(element.dataset.clockDiff, now);
  });

  document.querySelectorAll('[data-clock-day]').forEach((element) => {
    const diff = timeDayDiff(element.dataset.clockDay, TIME_BRASILIA, now);
    const text = timeDayLabel(diff);
    element.textContent = text;
    element.classList.toggle('is-visible', !!text);
  });

  document.querySelectorAll('[data-time-zone]').forEach((card) => {
    card.classList.toggle('is-selected', card.dataset.timeZone === zone);
  });

  if (timeSyncMode) {
    const card = $('#time-sync-card');
    if (card) {
      card.classList.remove('tick');
      void card.offsetWidth;
      card.classList.add('tick');
    }
  }
}

function startTimeTicker() {
  stopTimeTicker();
  updateTimeView(true);
  timeTicker = window.setInterval(() => updateTimeView(false), 250);
}

function stopTimeTicker() {
  if (timeTicker) {
    window.clearInterval(timeTicker);
    timeTicker = null;
  }
}

function setTimeZone(zone) {
  if (!TIME_ZONES.some((item) => item.zone === zone)) return;
  timeSelectedZone = zone;
  renderTimeView();
  startTimeTicker();
}

function setTimeSyncMode(enabled) {
  timeSyncMode = !!enabled;
  const card = $('#time-sync-card');
  if (card) card.classList.toggle('is-syncing', timeSyncMode);

  const button = $('#btn-time-sync');
  if (button) {
    button.textContent = timeSyncMode ? 'Encerrar modo de acerto' : 'Iniciar modo de acerto';
    button.setAttribute('aria-pressed', String(timeSyncMode));
  }

  if (timeSyncMode) {
    startTimeTicker();
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    card?.classList.remove('tick');
    updateTimeView(true);
  }
}

function bindTimeEvents() {
  $('#btn-time-menu')?.addEventListener('click', () => {
    closeDialogs();
    if (location.hash === '#/horarios') route();
    else location.hash = '#/horarios';
  });

  $('#time-zone-select')?.addEventListener('change', (event) => {
    setTimeZone(event.target.value);
  });

  $('#time-world-grid')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-time-zone]');
    if (!card) return;
    setTimeZone(card.dataset.timeZone);
    document.querySelector('.time-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#btn-time-sync')?.addEventListener('click', () => {
    setTimeSyncMode(!timeSyncMode);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimeTicker();
    } else if (document.body.dataset.view === 'horarios') {
      startTimeTicker();
    }
  });
}
