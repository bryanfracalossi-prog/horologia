'use strict';

/* ============================================================
   Horologia — Avaliador de Raridade
   Dados 100% locais (localStorage). Sem servidor, sem cadastro.
   ============================================================ */

const STORAGE_KEY = 'horologia.v1';
const PHOTO_MAX = 1400;

const CRITERIA = [
  { key: 'originalidade', label: 'Originalidade',           weight: 35, hint: 'Mostrador, ponteiros, caixa e peças de fábrica.' },
  { key: 'condicao',      label: 'Condição',                weight: 30, hint: 'Estado de conservação e polimento.' },
  { key: 'variacoes',     label: 'Variações / dial errors', weight: 20, hint: 'Erros de mostrador, séries especiais, protótipos.' },
  { key: 'procedencia',   label: 'Procedência / histórico', weight: 15, hint: 'História, donos e passagem em leilões.' }
];

const SCALE = [
  'Não avaliado', 'Muito baixo', 'Baixo', 'Médio', 'Alto', 'Excepcional'
];

const CLASSES = [
  { id: 'comum',       min: 0,  max: 19,  label: 'Comum',       color: '#6e7783' },
  { id: 'incomum',     min: 20, max: 39,  label: 'Incomum',     color: '#2f8a72' },
  { id: 'raro',        min: 40, max: 59,  label: 'Raro',        color: '#3568c9' },
  { id: 'muito-raro',  min: 60, max: 79,  label: 'Muito raro',  color: '#8a4fc4' },
  { id: 'excepcional', min: 80, max: 100, label: 'Excepcional', color: '#a8841f' }
];

const WATCH_SVG = `<svg class="ghost-watch" viewBox="0 0 64 64" aria-hidden="true">
  <rect x="25" y="1" width="14" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <rect x="25" y="51" width="14" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <circle cx="32" cy="32" r="18.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="1"/>
  <path d="M32 24.5V32l5 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="1.4" fill="currentColor"/>
  <path d="M50.5 30v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const state = {
  watches: [],
  query: '',
  sort: 'recentes',
  filter: 'todas',
  photo: null,
  editingId: null,
  publicWatch: null,
  shareWatch: null,
  shareUrl: '',
  shareHasPhoto: false,
  shareSeq: 0,
  assistSuggestion: null,
  assistMatches: [],
  assistPending: false,
  topQuery: '',
  topBrand: 'todas',
  historyQuery: '',
  historyEra: 'todas',
  storyDraft: null,
  storyLockWatch: false,
  storyBusy: false,
  prefill: null,
  formReturn: '#/'
};

/* ---------------- utilidades ---------------- */

const $ = (sel) => document.querySelector(sel);

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const nf = new Intl.NumberFormat('pt-BR');

function money(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  }).format(Number(value));
}

function fmtDate(ts) {
  if (!ts) return '—';
  try { return new Date(ts).toLocaleDateString('pt-BR'); } catch (e) { return '—'; }
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function scoreOf(w) {
  return Math.round(CRITERIA.reduce((sum, c) => sum + ((Number(w?.scores?.[c.key]) || 0) / 5) * c.weight, 0));
}

function classify(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  return CLASSES.find((c) => s >= c.min && s <= c.max) || CLASSES[CLASSES.length - 1];
}

function scoreRing(score, cls, size) {
  return `<span class="score${size === 'lg' ? ' lg' : ''}" style="--p:${score};--c:${cls.color}" aria-label="Nota ${score} de 100"><span>${score}</span></span>`;
}

function chipClass(cls) {
  return `<span class="chip-class" style="--c:${cls.color}">${cls.label}</span>`;
}

/* ---------------- persistência ---------------- */

function normalize(w) {
  const scores = {};
  CRITERIA.forEach((c) => {
    const raw = Number(w?.scores?.[c.key]);
    scores[c.key] = Number.isFinite(raw) ? Math.max(0, Math.min(5, Math.round(raw))) : 0;
  });
  const neg = w?.negociacao || {};
  return {
    id: String(w?.id || uid()),
    marca: String(w?.marca || ''),
    modelo: String(w?.modelo || ''),
    referencia: String(w?.referencia || ''),
    ano: w?.ano === '' || w?.ano === undefined ? null : (Number(w.ano) || null),
    movimento: String(w?.movimento || ''),
    caixa: String(w?.caixa || ''),
    diametro: w?.diametro === '' || w?.diametro === undefined ? null : (Number(w.diametro) || null),
    producao: w?.producao === '' || w?.producao === undefined ? null : (Number(w.producao) || null),
    notas: String(w?.notas || ''),
    photo: typeof w?.photo === 'string' && w.photo.startsWith('data:image') ? w.photo : null,
    historia: normalizeStory(w?.historia),
    scores,
    negociacao: {
      ativa: !!neg.ativa,
      cliente: String(neg.cliente || ''),
      status: String(neg.status || 'Em análise'),
      pedido: neg.pedido === '' || neg.pedido === undefined ? null : (Number(neg.pedido) || null),
      estimado: neg.estimado === '' || neg.estimado === undefined ? null : (Number(neg.estimado) || null)
    },
    criadoEm: Number(w?.criadoEm) || Date.now(),
    atualizadoEm: Number(w?.atualizadoEm) || Date.now(),
    exemplo: !!w?.exemplo
  };
}

function demoData() {
  return [
    normalize({
      id: 'demo-submariner',
      marca: 'Rolex',
      modelo: 'Submariner 5512',
      referencia: '5512',
      ano: 1962,
      movimento: 'Cal. 1530 automático',
      caixa: 'Aço inox',
      diametro: 40,
      producao: 4200,
      notas: 'Exemplo de ficha. Ajuste as notas dos critérios conforme a sua avaliação da peça real.',
      scores: { originalidade: 4, condicao: 4, variacoes: 2, procedencia: 3 },
      negociacao: { ativa: true, cliente: 'Exemplo de contato', status: 'Em análise', pedido: 78000, estimado: 69000 },
      criadoEm: Date.now() - 86400000,
      atualizadoEm: Date.now() - 86400000,
      exemplo: true
    }),
    normalize({
      id: 'demo-pogue',
      marca: 'Seiko',
      modelo: 'Chronograph 6139-6002 “Pogue”',
      referencia: '6139-6002',
      ano: 1971,
      movimento: 'Cal. 6139 automático',
      caixa: 'Aço inox',
      diametro: 41,
      producao: null,
      notas: 'Exemplo de ficha. Primeiro cronógrafo automático com roda vertical em órbita.',
      scores: { originalidade: 4, condicao: 3, variacoes: 1, procedencia: 2 },
      negociacao: { ativa: false, cliente: '', status: 'Em análise', pedido: null, estimado: null },
      criadoEm: Date.now() - 172800000,
      atualizadoEm: Date.now() - 172800000,
      exemplo: true
    })
  ];
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, watches: state.watches }));
    return true;
  } catch (err) {
    toast('Armazenamento cheio. Remova fotos grandes para salvar.');
    return false;
  }
}

function loadData() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
  if (!raw) {
    state.watches = demoData();
    persist();
    return;
  }
  try {
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : data?.watches;
    state.watches = Array.isArray(list) ? list.map(normalize) : [];
  } catch (e) {
    state.watches = [];
    toast('Não foi possível ler os dados salvos.');
  }
}

/* ---------------- toast ---------------- */

let toastTimer = null;

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2800);
}

/* ---------------- rota ---------------- */

function showView(name) {
  const viewId = name === 'historias'
    ? 'history-view'
    : name === 'horarios'
      ? 'time-view'
      : `${name}-view`;
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('is-active', v.id === viewId));
  document.body.dataset.view = name;
  const tab = name === 'top100'
    ? 'top100'
    : name === 'historias'
      ? 'historias'
      : name === 'horarios'
        ? 'horarios'
        : (name === 'list' ? 'catalogo' : null);
  document.querySelectorAll('#main-tabs a').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.tab === tab);
    if (link.dataset.tab === tab) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

let listScroll = 0;

function route() {
  closeDialogs();
  stopTimeTicker();

  const isList = $('#list-view').classList.contains('is-active');
  if (isList) listScroll = window.scrollY;

  const path = (location.hash || '#/').replace(/^#\/?/, '');
  const parts = path.split('/');

  if (parts[0] !== 'nova') state.prefill = null;

  if (parts[0] === 'v' && parts[1]) {
    renderPublic(parts.slice(1).join('/'));
    return;
  }

  if (parts[0] === 'top100') {
    renderTop100();
    showView('top100');
    window.scrollTo(0, 0);
    return;
  }

  if (parts[0] === 'historias') {
    renderHistoryView();
    showView('historias');
    window.scrollTo(0, 0);
    return;
  }

  if (parts[0] === 'horarios') {
    renderTimeView();
    showView('horarios');
    startTimeTicker();
    window.scrollTo(0, 0);
    return;
  }

  if (parts[0] === 'peca' && parts[1]) {
    renderDetail(decodeURIComponent(parts[1]));
    showView('detail');
    window.scrollTo(0, 0);
    return;
  }

  if (parts[0] === 'editar' && parts[1]) {
    const watch = state.watches.find((w) => w.id === decodeURIComponent(parts[1]));
    if (!watch) { location.replace('#/'); return; }
    renderForm(watch);
    showView('form');
    window.scrollTo(0, 0);
    return;
  }

  if (parts[0] === 'nova') {
    renderForm(null, state.prefill);
    state.prefill = null;
    showView('form');
    window.scrollTo(0, 0);
    if (state.assistPending) {
      state.assistPending = false;
      openAssist();
    }
    return;
  }

  closeDialogs();
  renderList();
  showView('list');
  window.scrollTo(0, listScroll);
}

/* ---------------- lista ---------------- */

function sorter(mode) {
  switch (mode) {
    case 'nota-desc': return (a, b) => scoreOf(b) - scoreOf(a);
    case 'nota-asc': return (a, b) => scoreOf(a) - scoreOf(b);
    case 'marca': return (a, b) => a.marca.localeCompare(b.marca, 'pt-BR') || a.modelo.localeCompare(b.modelo, 'pt-BR');
    case 'ano-desc': return (a, b) => (b.ano || 0) - (a.ano || 0);
    default: return (a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0);
  }
}

function cardHtml(w) {
  const score = scoreOf(w);
  const cls = classify(score);
  const meta = [];
  if (w.referencia) meta.push(`Ref. ${esc(w.referencia)}`);
  if (w.ano) meta.push(esc(w.ano));
  meta.push(`<span style="font-weight:600">${cls.label}</span>`);

  return `<a class="card" href="#/peca/${encodeURIComponent(w.id)}" style="--cls:${cls.color}">
    <div class="card-photo">
      ${w.photo ? `<img src="${esc(w.photo)}" alt="Foto do ${esc(w.marca)} ${esc(w.modelo)}" loading="lazy">` : WATCH_SVG}
      ${w.negociacao?.ativa ? `<span class="tag-neg">${esc(w.negociacao.status || 'Negociação')}</span>` : ''}
      ${w.historia ? '<span class="tag-story">História</span>' : ''}
    </div>
    <div class="card-body">
      <span class="card-brand">${esc(w.marca) || 'Sem marca'}</span>
      <span class="card-model">${esc(w.modelo) || 'Sem modelo'}</span>
      <span class="card-score">${scoreRing(score, cls)}</span>
      <div class="card-meta">${meta.join('<span class="dot">·</span>')}</div>
    </div>
  </a>`;
}

function renderList() {
  const grid = $('#grid');
  const scores = state.watches.map(scoreOf);
  const total = state.watches.length;
  const avg = total ? scores.reduce((a, b) => a + b, 0) / total : null;
  const exc = scores.filter((s) => s >= 80).length;

  $('#stat-total').textContent = nf.format(total);
  $('#stat-avg').textContent = avg === null ? '—' : avg.toFixed(1).replace('.', ',');
  $('#stat-exc').textContent = nf.format(exc);

  const q = normText(state.query);
  let items = state.watches.slice();

  if (q) {
    items = items.filter((w) => normText([
      w.marca, w.modelo, w.referencia, w.notas, w.movimento, w.caixa,
      w.historia?.titulo, w.historia?.texto
    ].join(' ')).includes(q));
  }

  if (state.filter !== 'todas') {
    items = items.filter((w) => classify(scoreOf(w)).id === state.filter);
  }

  items.sort(sorter(state.sort));

  grid.innerHTML = items.length
    ? items.map(cardHtml).join('')
    : emptyHtml(total > 0);

  renderChips();
}

function renderChips() {
  const counts = { todas: state.watches.length };
  CLASSES.forEach((c) => { counts[c.id] = 0; });
  state.watches.forEach((w) => { counts[classify(scoreOf(w)).id] += 1; });

  const chips = [{ id: 'todas', label: 'Todas', color: null }].concat(CLASSES);

  $('#filter-chips').innerHTML = chips.map((c) => {
    const on = state.filter === c.id;
    return `<button type="button" class="chip${on ? ' is-on' : ''}" data-filter="${c.id}">
      ${c.label}<span class="count">${counts[c.id] || 0}</span>
    </button>`;
  }).join('');
}

function emptyHtml(hasItems) {
  const title = hasItems ? 'Nenhuma peça encontrada' : 'Seu catálogo está vazio';
  const text = hasItems
    ? 'Tente outro termo de busca ou remova o filtro de classificação.'
    : 'Cadastre o primeiro relógio, avalie os quatro critérios e veja a nota de raridade de 0 a 100.';
  return `<div class="empty">
    ${WATCH_SVG}
    <h3>${title}</h3>
    <p>${text}</p>
    <a class="btn btn-gold" href="#/nova">+ Novo relógio</a>
  </div>`;
}

/* ---------------- top 100 ---------------- */

let rankingCache = null;

function rankingEntries() {
  if (rankingCache) return rankingCache;
  const data = typeof RANKING !== 'undefined' && Array.isArray(RANKING) ? RANKING : [];
  rankingCache = data.map((entry, index) => ({
    ...entry,
    key: `${normText(entry.marca)}-${normText(entry.modelo)}-${index}`,
    anoInicio: Number((String(entry.anos).match(/\d{4}/) || [])[0]) || null
  })).sort((a, b) => (b.nota - a.nota)
    || ((a.anoInicio || 9999) - (b.anoInicio || 9999))
    || a.marca.localeCompare(b.marca, 'pt-BR')
    || a.modelo.localeCompare(b.modelo, 'pt-BR'));
  return rankingCache;
}

function renderTop100() {
  const all = rankingEntries();
  const search = $('#top-search');
  if (search && search.value !== state.topQuery) search.value = state.topQuery;

  const brandSelect = $('#top-brand');
  if (brandSelect && brandSelect.options.length <= 1) {
    const brands = [...new Set(all.map((entry) => entry.marca))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    brandSelect.insertAdjacentHTML('beforeend', brands
      .map((brand) => `<option value="${esc(brand)}">${esc(brand)}</option>`)
      .join(''));
  }
  if (brandSelect) brandSelect.value = state.topBrand;

  const q = normText(state.topQuery);
  const items = all.filter((entry) => {
    if (state.topBrand !== 'todas' && entry.marca !== state.topBrand) return false;
    if (!q) return true;
    return normText([entry.marca, entry.modelo, entry.ref, entry.anos, entry.motivo].join(' ')).includes(q);
  });

  const avg = all.length ? all.reduce((sum, entry) => sum + entry.nota, 0) / all.length : null;
  $('#top-total').textContent = nf.format(all.length);
  $('#top-avg').textContent = avg === null ? '—' : avg.toFixed(1).replace('.', ',');
  $('#top-exc').textContent = nf.format(all.filter((entry) => entry.nota >= 80).length);
  $('#top-count').textContent = (q || state.topBrand !== 'todas')
    ? `${nf.format(items.length)} de ${nf.format(all.length)} relógios`
    : `${nf.format(all.length)} relógios`;

  const list = $('#top-list');
  if (!items.length) {
    list.innerHTML = '<div class="top-empty">Nenhum relógio encontrado com esse filtro. Tente outra marca ou outro termo.</div>';
    return;
  }

  list.innerHTML = items.map((entry) => {
    const rank = all.indexOf(entry) + 1;
    const cls = classify(entry.nota);
    const key = esc(entry.key);
    return `<article class="top-item${rank <= 3 ? ' is-podium' : ''}" data-top-key="${key}">
      <button class="top-row" type="button" data-top-toggle="${key}" aria-expanded="false" aria-controls="top-detail-${key}">
        <span class="top-rank">${String(rank).padStart(2, '0')}</span>
        <span class="top-main">
          <span class="top-brand">${esc(entry.marca)}</span>
          <span class="top-model">${esc(entry.modelo)}</span>
          <span class="top-meta">${esc(entry.anos)}${entry.ref ? ` · Ref. ${esc(entry.ref)}` : ''}</span>
        </span>
        <span class="top-note"><b>${entry.nota}</b><span>/100</span></span>
        <span class="top-class">${chipClass(cls)}</span>
        <span class="top-toggle" aria-hidden="true">+</span>
      </button>
      <div class="top-detail" id="top-detail-${key}" hidden>
        <p>${esc(entry.motivo)}</p>
        <dl>
          <div><dt>Produção</dt><dd>${esc(entry.produzidos || 'Não informada')}</dd></div>
          <div><dt>Ano / período</dt><dd>${esc(entry.anos)}</dd></div>
          <div><dt>Referência</dt><dd>${esc(entry.ref || '—')}</dd></div>
        </dl>
        <button type="button" class="btn btn-ghost btn-sm" data-top-use="${key}">Usar como base para avaliar uma peça</button>
      </div>
    </article>`;
  }).join('');
}

async function copyTopLink() {
  const url = `${location.origin}${location.pathname}#/top100`;
  const message = isLocalOrigin()
    ? 'Link copiado, mas só abre neste computador. Use o endereço público do app.'
    : 'Link do Top 100 copiado.';

  try {
    await navigator.clipboard.writeText(url);
    toast(message);
    return;
  } catch (e) { /* tenta o método antigo */ }

  const field = document.createElement('textarea');
  field.value = url;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  try { document.execCommand('copy'); toast(message); }
  catch (err) { toast('Não foi possível copiar. Copie o endereço do navegador.'); }
  field.remove();
}

function startFromRanking(key) {
  const all = rankingEntries();
  const entry = all.find((item) => item.key === key);
  if (!entry) return;
  state.prefill = {
    marca: entry.marca,
    modelo: entry.modelo,
    referencia: entry.ref || '',
    ano: entry.anoInicio,
    returnTo: '#/top100'
  };
  state.formReturn = '#/top100';
  location.hash = '#/nova';
  toast('Dados preenchidos. Complete as notas da peça.');
}


/* ---------------- detalhe ---------------- */

function detailHtml(w, opts = {}) {
  const isPublic = !!opts.public;
  const score = scoreOf(w);
  const cls = classify(score);
  const neg = w.negociacao || {};

  const tags = [];
  if (w.referencia) tags.push(`<span class="tag-plain">Ref. ${esc(w.referencia)}</span>`);
  if (w.ano) tags.push(`<span class="tag-plain">${esc(w.ano)}</span>`);
  if (!isPublic && neg.ativa) tags.push(`<span class="tag-plain">${esc(neg.status || 'Negociação')}</span>`);

  const ficha = [
    ['Marca', esc(w.marca) || '—'],
    ['Modelo', esc(w.modelo) || '—'],
    ['Referência', esc(w.referencia) || '—'],
    ['Ano', w.ano ? esc(w.ano) : '—'],
    ['Movimento', esc(w.movimento) || '—'],
    ['Caixa', esc(w.caixa) || '—'],
    ['Diâmetro', w.diametro ? `${esc(w.diametro)} mm` : '—'],
    ['Produção estimada', w.producao ? `${nf.format(w.producao)} unid.` : 'Não informada']
  ];

  if (!isPublic) ficha.push(['No catálogo desde', fmtDate(w.criadoEm)]);

  const bars = CRITERIA.map((c) => {
    const value = Number(w.scores?.[c.key]) || 0;
    const points = Math.round((value / 5) * c.weight);
    return `<li class="bar-row">
      <span class="bar-label">${c.label}</span>
      <span class="bar-points"><b>${SCALE[value]}</b> · ${points}/${c.weight}</span>
      <span class="bar"><i style="width:${(value / 5) * 100}%"></i></span>
    </li>`;
  }).join('');

  const negHtml = !isPublic && neg.ativa ? `<div class="panel">
      <h3 class="panel-title">Negociação</h3>
      <dl class="defs">
        <div><dt>Cliente / vendedor</dt><dd>${esc(neg.cliente) || '—'}</dd></div>
        <div><dt>Situação</dt><dd>${esc(neg.status) || '—'}</dd></div>
        <div><dt>Preço pedido</dt><dd>${money(neg.pedido)}</dd></div>
        <div><dt>Valor estimado</dt><dd>${money(neg.estimado)}</dd></div>
      </dl>
    </div>` : '';

  const actions = isPublic
    ? `<button class="btn btn-gold" type="button" id="btn-save-public">Salvar na minha coleção</button>
       <button class="btn btn-ghost" type="button" id="btn-auth-detail">Check-up</button>
       <button class="btn btn-ghost" type="button" id="btn-print">Imprimir</button>`
    : `<a class="btn btn-ghost" href="#/editar/${encodeURIComponent(w.id)}">Editar</a>
       <button class="btn btn-ghost" type="button" id="btn-share">Compartilhar</button>
       <button class="btn btn-ghost" type="button" id="btn-auth-detail">Check-up</button>
       <button class="btn btn-ghost" type="button" id="btn-print">Imprimir laudo</button>
       <button class="btn btn-danger" type="button" id="btn-delete">Excluir</button>`;

  const banner = isPublic
    ? `<div class="public-banner no-print">
        <span class="public-dot" aria-hidden="true"></span>
        Ficha pública compartilhada por <strong>${esc(opts.autor || 'anônimo')}</strong>
      </div>`
    : '';

  return `${banner}
    <div class="print-head">HOROLOGIA · Laudo de raridade <span>Emitido em ${fmtDate(Date.now())}</span></div>

    <div class="detail-top">
      <div class="detail-title-wrap">
        <span class="detail-brand">${esc(w.marca) || 'Sem marca'}</span>
        <h2 class="detail-model">${esc(w.modelo) || 'Sem modelo'}</h2>
        <div class="tagrow">
          ${chipClass(cls)}
          ${tags.join('')}
        </div>
      </div>
      <div class="detail-actions no-print">${actions}</div>
    </div>

    <div class="detail-grid">
      <div class="detail-col">
        <div class="detail-photo">
          ${w.photo ? `<img src="${esc(w.photo)}" alt="Foto do ${esc(w.marca)} ${esc(w.modelo)}">` : WATCH_SVG}
        </div>

        <div class="panel ficha-panel">
          <h3 class="panel-title">Ficha técnica</h3>
          <dl class="ficha">
            ${ficha.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
          </dl>
        </div>
      </div>

      <div class="detail-col">
        <div class="panel score-panel">
          ${scoreRing(score, cls, 'lg')}
          <div class="score-panel-text">
            <strong>Nota de raridade</strong>
            <div class="tagrow">${chipClass(cls)}</div>
            <small>${score} de 100 pontos</small>
          </div>
        </div>

        <div class="panel criteria-panel">
          <h3 class="panel-title">Critérios avaliados</h3>
          <ul class="bars">${bars}</ul>
        </div>
      </div>
    </div>

    ${storyPanelHtml(w, isPublic)}

    ${w.notas ? `<div class="panel">
      <h3 class="panel-title">Observações</h3>
      <p class="detail-notes">${esc(w.notas)}</p>
    </div>` : ''}

    ${negHtml}

    ${isPublic ? `<p class="public-foot no-print">Avaliação feita no Horologia — nota de raridade de 0 a 100</p>` : ''}
  `;
}

function renderDetail(id) {
  const watch = state.watches.find((x) => x.id === id);
  if (!watch) { location.replace('#/'); return; }
  state.publicWatch = null;
  $('#detail').innerHTML = detailHtml(watch);
}

function renderPublic(payload) {
  let data;
  try {
    data = JSON.parse(decodePayload(payload));
    if (!data || !data.mo) throw new Error('sem modelo');
  } catch (err) {
    toast('Este link está incompleto ou inválido.');
    location.replace('#/');
    return;
  }

  const watch = watchFromPayload(data);
  state.publicWatch = watch;
  $('#detail').innerHTML = detailHtml(watch, { public: true, autor: data.au });
  showView('detail');
  window.scrollTo(0, 0);
}

/* ---------------- formulário ---------------- */

function buildCriteriaForm() {
  $('#criteria-list').innerHTML = CRITERIA.map((c) => `
    <div class="crit">
      <div class="crit-head">
        <span class="crit-name">${c.label}</span>
        <span class="crit-weight">peso ${c.weight}%</span>
      </div>
      <p class="crit-hint">${c.hint}</p>
      <input type="range" min="0" max="5" step="1" value="0" data-key="${c.key}" aria-label="${c.label}">
      <div class="crit-scale"><span>0</span><b data-out="${c.key}">Não avaliado (0)</b><span>5</span></div>
    </div>
  `).join('');
}

function syncCriteriaLabels() {
  document.querySelectorAll('#criteria-list input[type="range"]').forEach((input) => {
    const out = document.querySelector(`[data-out="${input.dataset.key}"]`);
    if (out) out.textContent = `${SCALE[Number(input.value)]} (${input.value})`;
  });
}

function readScores() {
  const scores = {};
  document.querySelectorAll('#criteria-list input[type="range"]').forEach((input) => {
    scores[input.dataset.key] = Number(input.value) || 0;
  });
  return scores;
}

function updateLiveScore() {
  const score = scoreOf({ scores: readScores() });
  const cls = classify(score);
  $('#live-score').innerHTML = `
    ${scoreRing(score, cls, 'lg')}
    <div>
      <strong>Nota de raridade</strong>
      <div class="tagrow">${chipClass(cls)}</div>
      <small>${score} de 100 pontos — atualiza conforme você avalia.</small>
    </div>
  `;
}

function updatePhotoPreview() {
  const box = $('#photo-preview');
  if (state.photo) {
    box.innerHTML = `<img src="${esc(state.photo)}" alt="Prévia da foto">`;
    $('#photo-btn-label').textContent = 'Trocar foto';
  } else {
    box.innerHTML = WATCH_SVG + '<span class="photo-hint">Sem foto</span>';
    $('#photo-btn-label').textContent = 'Escolher foto';
  }
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

function renderForm(watch, prefill = null) {
  const data = watch || prefill || null;
  state.editingId = watch ? watch.id : null;
  state.photo = data?.photo || null;
  state.formReturn = prefill?.returnTo || '#/';

  $('#form-title').textContent = watch ? 'Editar avaliação' : 'Novo relógio';
  document.querySelector('#form-view .back').setAttribute('href',
    watch ? `#/peca/${encodeURIComponent(watch.id)}` : state.formReturn);

  setVal('f-marca', data?.marca || '');
  setVal('f-modelo', data?.modelo || '');
  setVal('f-referencia', data?.referencia || '');
  setVal('f-ano', data?.ano ?? '');
  setVal('f-movimento', data?.movimento || '');
  setVal('f-caixa', data?.caixa || '');
  setVal('f-diametro', data?.diametro ?? '');
  setVal('f-producao', data?.producao ?? '');
  setVal('f-notas', data?.notas || '');

  const neg = data?.negociacao || {};
  $('#f-neg-ativa').checked = !!neg.ativa;
  $('#neg-fields').classList.toggle('hidden', !neg.ativa);
  setVal('f-cliente', neg.cliente || '');
  setVal('f-status', neg.status || 'Em análise');
  setVal('f-pedido', neg.pedido ?? '');
  setVal('f-estimado', neg.estimado ?? '');

  document.querySelectorAll('#criteria-list input[type="range"]').forEach((input) => {
    const value = data?.scores?.[input.dataset.key];
    input.value = Number.isFinite(Number(value)) && value !== null ? value : 0;
  });

  syncCriteriaLabels();
  updateLiveScore();
  updatePhotoPreview();
}

function numVal(id) {
  const raw = document.getElementById(id).value.trim();
  if (raw === '') return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function strVal(id) {
  return document.getElementById(id).value.trim();
}

function collectForm() {
  return {
    marca: strVal('f-marca'),
    modelo: strVal('f-modelo'),
    referencia: strVal('f-referencia'),
    ano: numVal('f-ano'),
    movimento: strVal('f-movimento'),
    caixa: strVal('f-caixa'),
    diametro: numVal('f-diametro'),
    producao: numVal('f-producao'),
    notas: strVal('f-notas'),
    photo: state.photo,
    scores: readScores(),
    negociacao: {
      ativa: $('#f-neg-ativa').checked,
      cliente: strVal('f-cliente'),
      status: $('#f-status').value,
      pedido: numVal('f-pedido'),
      estimado: numVal('f-estimado')
    }
  };
}

function compressFile(file, maxSide, quality, background) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = background || '#0a0e12';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file) {
  return compressFile(file, PHOTO_MAX, 0.82, '#0a0e12');
}

/* ---------------- diálogos ---------------- */

function openDialog(dialog) {
  if (dialog?.showModal) dialog.showModal();
  else dialog?.setAttribute('open', '');
}

function closeDialogs() {
  document.querySelectorAll('dialog[open]').forEach((dialog) => {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });
}

function buildAbout() {
  $('#weights-list').innerHTML = CRITERIA
    .map((c) => `<li><span>${c.label}</span><span>${c.weight}%</span></li>`)
    .join('');

  $('#classes-list').innerHTML = CLASSES
    .map((c) => `<li><span>${c.label}</span><span>${c.min}–${c.max} pontos</span></li>`)
    .join('');
}

/* ---------------- backup ---------------- */

function exportBackup() {
  const payload = {
    app: 'Horologia',
    version: 1,
    exportadoEm: new Date().toISOString(),
    watches: state.watches
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `horologia-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  toast('Backup exportado.');
}

function mergeImport(items) {
  let added = 0;
  let updated = 0;

  items.forEach((raw) => {
    const watch = normalize(raw);
    const existing = watch.id ? state.watches.find((w) => w.id === watch.id) : null;
    if (existing) {
      const merged = normalize({ ...existing, ...watch, id: existing.id, criadoEm: existing.criadoEm });
      Object.assign(existing, merged);
      updated += 1;
    } else {
      if (!watch.id || state.watches.some((w) => w.id === watch.id)) watch.id = uid();
      state.watches.push(watch);
      added += 1;
    }
  });

  persist();
  renderList();
  toast(`${added} peça(s) importada(s), ${updated} atualizada(s).`);
}

/* ---------------- compartilhamento ---------------- */

const AUTHOR_KEY = 'horologia.autor';
const SHARE_MAX_CHARS = 60000;

function encodePayload(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodePayload(payload) {
  let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function resizeDataUrl(dataUrl, maxSide, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a0e12';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

function shareUrlFor(json) {
  const base = `${location.origin}${location.pathname}`;
  return `${base}#/v/${encodePayload(json)}`;
}

async function buildShareUrl(watch, autor) {
  const base = {
    v: 1,
    m: watch.marca, mo: watch.modelo, r: watch.referencia,
    a: watch.ano, mv: watch.movimento, cx: watch.caixa,
    d: watch.diametro, p: watch.producao, n: watch.notas,
    s: CRITERIA.map((c) => Number(watch.scores?.[c.key]) || 0),
    au: autor
  };

  const tries = watch.photo
    ? [[520, 0.62], [420, 0.56], [340, 0.5], [0, 0]]
    : [[0, 0]];

  let last = null;
  for (const [maxSide, quality] of tries) {
    const photo = maxSide ? await resizeDataUrl(watch.photo, maxSide, quality) : null;
    const json = JSON.stringify({ ...base, ph: photo });
    last = { url: shareUrlFor(json), hasPhoto: !!photo, chars: json.length };
    if (last.url.length <= SHARE_MAX_CHARS) return last;
  }
  return last;
}

function watchFromPayload(data) {
  const scores = {};
  CRITERIA.forEach((c, index) => {
    const raw = Number(data?.s?.[index]);
    scores[c.key] = Number.isFinite(raw) ? Math.max(0, Math.min(5, Math.round(raw))) : 0;
  });
  return normalize({
    marca: data?.m,
    modelo: data?.mo,
    referencia: data?.r,
    ano: data?.a,
    movimento: data?.mv,
    caixa: data?.cx,
    diametro: data?.d,
    producao: data?.p,
    notas: data?.n,
    photo: data?.ph,
    scores,
    negociacao: { ativa: false },
    criadoEm: Date.now(),
    atualizadoEm: Date.now()
  });
}

function savedAuthor() {
  try { return localStorage.getItem(AUTHOR_KEY) || ''; } catch (e) { return ''; }
}

function storeAuthor(value) {
  try { localStorage.setItem(AUTHOR_KEY, value); } catch (e) { /* sem armazenamento */ }
}

function openShare(watch) {
  state.shareWatch = watch;
  state.shareUrl = '';
  $('#share-author').value = savedAuthor();
  $('#share-url').value = 'Gerando link…';
  $('#share-size').textContent = '';
  $('#share-warning').hidden = true;
  openDialog($('#share-dialog'));
  refreshShareLink();
}

function isLocalOrigin() {
  const host = location.hostname;
  return location.protocol === 'file:'
    || host === 'localhost'
    || host === '127.0.0.1'
    || host === '0.0.0.0'
    || host === '::1'
    || /^192\.168\./.test(host)
    || /^10\./.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
}

async function refreshShareLink() {
  const watch = state.shareWatch;
  if (!watch) return;

  const author = $('#share-author').value.trim().slice(0, 40);
  storeAuthor(author);

  const seq = ++state.shareSeq;
  $('#share-size').textContent = watch.photo ? 'Preparando a foto…' : 'Montando o link…';

  const result = await buildShareUrl(watch, author);
  if (seq !== state.shareSeq) return;

  state.shareUrl = result.url;
  state.shareHasPhoto = result.hasPhoto;

  $('#share-url').value = result.url;
  if (result.hasPhoto) {
    $('#share-size').textContent = `Link com foto · ${Math.max(1, Math.round(result.url.length / 1024))} KB`;
  } else if (watch.photo) {
    $('#share-size').textContent = 'Link sem foto (a imagem ficou grande demais para caber no link).';
  } else {
    $('#share-size').textContent = 'Link sem foto (esta peça não tem foto cadastrada).';
  }
  $('#share-warning').hidden = !isLocalOrigin();
}

async function copyShareLink() {
  if (!state.shareUrl) {
    toast('O link ainda está sendo gerado.');
    return;
  }
  try {
    await navigator.clipboard.writeText(state.shareUrl);
    toast('Link copiado.');
    return;
  } catch (err) { /* tenta o método antigo */ }

  const field = $('#share-url');
  field.focus();
  field.select();
  try {
    document.execCommand('copy');
    toast('Link copiado.');
  } catch (e) {
    toast('Selecione o link e copie manualmente.');
  }
}

async function nativeShare() {
  if (!state.shareUrl) {
    toast('O link ainda está sendo gerado.');
    return;
  }
  if (!navigator.share) {
    toast('Envio direto indisponível aqui. Use “Copiar link”.');
    return;
  }
  try {
    await navigator.share({
      title: `${state.shareWatch.marca} ${state.shareWatch.modelo} — Horologia`,
      text: 'Ficha de raridade no Horologia',
      url: state.shareUrl
    });
  } catch (err) { /* usuário cancelou */ }
}

function slugify(text) {
  return String(text || 'relogio')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'relogio';
}

function standaloneHtml(watch, autor) {
  const score = scoreOf(watch);
  const cls = classify(score);

  const bars = CRITERIA.map((c) => {
    const value = Number(watch.scores?.[c.key]) || 0;
    const points = Math.round((value / 5) * c.weight);
    return `<li>
      <span class="bl">${c.label}</span>
      <span class="bp">${SCALE[value]} · ${points}/${c.weight}</span>
      <span class="bt"><i style="width:${(value / 5) * 100}%"></i></span>
    </li>`;
  }).join('');

  const rows = [
    ['Marca', watch.marca], ['Modelo', watch.modelo], ['Referência', watch.referencia],
    ['Ano', watch.ano], ['Movimento', watch.movimento], ['Caixa', watch.caixa],
    ['Diâmetro', watch.diametro ? `${watch.diametro} mm` : ''],
    ['Produção estimada', watch.producao ? `${nf.format(watch.producao)} unid.` : '']
  ].filter((row) => row[1])
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`)
    .join('');

  const photo = watch.photo
    ? `<img src="${esc(watch.photo)}" alt="Foto do relógio">`
    : '<div class="noimg">Sem foto</div>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(watch.marca)} ${esc(watch.modelo)} — Horologia</title>
<style>
  :root { --gold:#b8891f; --gold-soft:#efd48c; --pearl:#f6e7bd; --panel:#fff8e3; --line:#d9c187; --text:#0b0b0b; --muted:#1c1c1c; }
  * { box-sizing:border-box; }
  body { margin:0; color:var(--text); font-family:"Segoe UI", system-ui, sans-serif; line-height:1.5; padding:26px 18px 40px;
    background-color:var(--pearl);
    background-image:repeating-linear-gradient(115deg, rgba(184,137,31,.10) 0 2px, transparent 2px 22px); }
  .wrap { max-width:760px; margin:0 auto; }
  header { display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid var(--line);
    padding-bottom:14px; margin-bottom:24px; }
  .logo { font-family:Georgia,serif; font-size:22px; letter-spacing:.10em; color:var(--text); }
  header span:last-child { font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); }
  .hero { display:grid; grid-template-columns:1fr 1fr; gap:22px; }
  .photo { border:1px solid var(--line); border-radius:16px; overflow:hidden; background:var(--panel); min-height:320px; }
  .photo img { width:100%; height:100%; object-fit:cover; display:block; }
  .noimg { display:grid; place-items:center; height:100%; color:var(--muted); font-size:12px; letter-spacing:.2em; text-transform:uppercase; }
  .brand { font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--text); }
  h1 { font-family:Georgia,serif; font-weight:600; font-size:30px; line-height:1.15; margin:4px 0 10px; color:var(--text); }
  .chip { display:inline-block; padding:5px 11px; border-radius:999px; border:1px solid ${cls.color};
    background:${cls.color}1f; color:var(--text); font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
  .score { display:flex; align-items:baseline; gap:8px; margin:16px 0 4px; }
  .score b { font-family:Georgia,serif; font-size:52px; line-height:1; color:var(--text); }
  .score span { color:var(--muted); font-size:12px; letter-spacing:.08em; text-transform:uppercase; }
  .meta { color:var(--muted); font-size:13px; }
  h2 { font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); font-weight:600;
    margin:28px 0 12px; border-bottom:1px solid var(--line); padding-bottom:8px; }
  ul.bars { list-style:none; margin:0; padding:0; display:grid; gap:12px; }
  ul.bars li { display:grid; grid-template-columns:1fr auto; gap:3px 10px; }
  .bl { font-size:13.5px; color:var(--text); }
  .bp { font-size:11.5px; color:var(--muted); }
  .bt { grid-column:1 / -1; height:7px; border-radius:99px; background:#eadfc6; overflow:hidden; }
  .bt i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,#a9821f,var(--gold)); }
  dl { display:grid; grid-template-columns:1fr 1fr; gap:12px 18px; margin:0; }
  dt { font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
  dd { margin:2px 0 0; font-size:14.5px; color:var(--text); }
  .notes { white-space:pre-wrap; color:var(--text); font-size:14px; margin:0; }
  footer { margin-top:32px; padding-top:14px; border-top:1px solid var(--line); color:var(--muted); font-size:12px;
    display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  footer b { color:var(--text); font-weight:600; }
  @media (max-width:620px) { .hero { grid-template-columns:1fr; } h1 { font-size:25px; } .photo { aspect-ratio:4/3; min-height:0; } }
  @media print {
    body { background:#fff; color:#111; padding:0; }
    .photo { border-color:#ddd; } header { border-color:#ddd; } .logo { color:#111; }
    h2, footer, dt, header span:last-child { color:#111; border-color:#ddd; }
    .score b, footer b, .bl, dd, .notes { color:#111; } .chip { color:#111; border-color:#bbb; background:#fff; }
    .bt { background:#e6e6e6; } .bt i { background:#b8952f; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <header><span class="logo">Horologia</span><span>Laudo de raridade</span></header>

    <div class="hero">
      <div class="photo">${photo}</div>
      <div>
        <span class="brand">${esc(watch.marca) || 'Sem marca'}</span>
        <h1>${esc(watch.modelo) || 'Sem modelo'}</h1>
        <span class="chip">${cls.label}</span>
        <div class="score"><b>${score}</b><span>de 100 pontos</span></div>
        <p class="meta">${[watch.referencia ? `Ref. ${esc(watch.referencia)}` : '', watch.ano || ''].filter(Boolean).join(' · ')}</p>

        <h2>Critérios avaliados</h2>
        <ul class="bars">${bars}</ul>
      </div>
    </div>

    <h2>Ficha técnica</h2>
    <dl>${rows}</dl>

    ${watch.notas ? `<h2>Observações</h2><p class="notes">${esc(watch.notas)}</p>` : ''}

    <footer>
      <span>Compartilhado por <b>${esc(autor) || 'anônimo'}</b></span>
      <span>${fmtDate(Date.now())} · feito no Horologia</span>
    </footer>
  </div>
</body>
</html>`;
}

function downloadFichaHtml() {
  const watch = state.shareWatch;
  if (!watch) return;

  const autor = $('#share-author').value.trim().slice(0, 40);
  const html = standaloneHtml(watch, autor);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ficha-${slugify(`${watch.marca} ${watch.modelo}`)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  toast('Ficha baixada. Envie o arquivo por WhatsApp ou e-mail.');
}

function savePublicToCollection() {
  const source = state.publicWatch;
  if (!source) return;

  const copy = normalize({ ...source, id: uid(), criadoEm: Date.now(), atualizadoEm: Date.now() });
  state.watches.push(copy);
  persist();
  toast('Ficha salva na sua coleção.');
  location.hash = `#/peca/${encodeURIComponent(copy.id)}`;
}

/* ---------------- avaliação assistida ---------------- */

const QUIZ = [
  {
    key: 'originalidade_mostrador',
    criterion: 'originalidade',
    title: 'O mostrador e os ponteiros parecem originais?',
    sub: 'Veja o acabamento, a cor e se o mostrador combina com o ano da peça.',
    opts: [
      ['Tudo original, tenho certeza', 5],
      ['Parece original, sem sinais de troca', 4],
      ['Não tenho certeza', 3],
      ['Sei que o mostrador ou os ponteiros foram trocados', 1],
      ['Foi restaurado ou repintado', 1],
      ['Não sei avaliar', 2]
    ]
  },
  {
    key: 'originalidade_caixa',
    criterion: 'originalidade',
    title: 'A caixa, a coroa e a pulseira parecem originais?',
    sub: 'Confira encaixes, marcas de polimento e peças de outra época.',
    opts: [
      ['Tudo original e no lugar', 5],
      ['Parece original, mas não conferi tudo', 4],
      ['Alguma peça foi trocada por outra de época', 3],
      ['Tem peças de outra marca ou geração', 1],
      ['Não sei', 2]
    ]
  },
  {
    key: 'condicao_geral',
    criterion: 'condicao',
    title: 'Como está o estado geral da peça?',
    sub: 'Olhe riscos, amassados, trincas e desgaste do mostrador.',
    opts: [
      ['Como novo, sem marcas de uso', 5],
      ['Marcas leves, muito bem conservado', 4],
      ['Marcas de uso normais', 3],
      ['Marcas visíveis, riscos ou amassados', 2],
      ['Bem desgastado, com peças faltando ou trincado', 1],
      ['Não sei', 2]
    ]
  },
  {
    key: 'condicao_funcionamento',
    criterion: 'condicao',
    title: 'Como está o funcionamento?',
    sub: 'Teste a corda, o cronógrafo, a data e o alarme, se tiver.',
    opts: [
      ['Funciona perfeitamente e foi revisado', 5],
      ['Funciona bem, sem revisão recente', 4],
      ['Funciona, mas atrasa ou tem falhas', 3],
      ['Precisa de revisão', 2],
      ['Não funciona', 0],
      ['Não sei', 2]
    ]
  },
  {
    key: 'variacoes',
    criterion: 'variacoes',
    title: 'A peça tem alguma variação fora do comum?',
    sub: 'Ex.: erro de mostrador (dial error), versão de transição, protótipo.',
    opts: [
      ['Sim, é uma variação rara e reconhecida', 5],
      ['Sim, é uma versão especial ou de transição', 4],
      ['Talvez, mas não tenho certeza', 3],
      ['É a versão comum, sem variações', 1],
      ['Não sei o que é isso', 2]
    ]
  },
  {
    key: 'procedencia',
    criterion: 'procedencia',
    title: 'Quais documentos ou histórico você tem?',
    sub: 'Caixa, papéis, nota fiscal, revisões e histórico de donos.',
    opts: [
      ['Documentos, caixa, papéis e histórico completo', 5],
      ['Caixa e papéis de origem', 4],
      ['Nota fiscal ou revisões, sem caixa e papéis', 3],
      ['Só a palavra do vendedor', 2],
      ['Nenhum histórico', 1],
      ['Não sei', 2]
    ]
  }
];

const REF_INDEX = { producao: 0, originalidade: 1, condicao: 2, demanda: 3, variacoes: 4, procedencia: 5 };

function showAssistView(name) {
  ['home', 'ref', 'quiz', 'result'].forEach((view) => {
    const section = document.getElementById(`assist-${view}`);
    if (section) section.hidden = view !== name;
  });
  const dialog = $('#assist-dialog');
  if (dialog) dialog.scrollTop = 0;
}

function fillRefInputs() {
  const marca = $('#assist-marca');
  const modelo = $('#assist-modelo');
  if (!marca || !modelo) return;
  if (!marca.value) marca.value = strVal('f-marca');
  if (!modelo.value) {
    modelo.value = [strVal('f-modelo'), strVal('f-referencia')].filter(Boolean).join(' ');
  }
}

function openAssist() {
  state.assistSuggestion = null;
  state.assistMatches = [];
  const status = $('#assist-ref-status');
  if (status) { status.textContent = ''; status.style.color = ''; }
  const results = $('#assist-ref-results');
  if (results) results.innerHTML = '';
  const marca = $('#assist-marca');
  const modelo = $('#assist-modelo');
  if (marca) marca.value = strVal('f-marca');
  if (modelo) modelo.value = [strVal('f-modelo'), strVal('f-referencia')].filter(Boolean).join(' ');
  showAssistView('home');
  openDialog($('#assist-dialog'));
}

function renderQuiz() {
  $('#quiz-list').innerHTML = QUIZ.map((question, index) => `
    <div class="quiz-q">
      <p class="quiz-title">${index + 1}. ${esc(question.title)}</p>
      ${question.sub ? `<p class="quiz-sub">${esc(question.sub)}</p>` : ''}
      <div class="quiz-opts">
        ${question.opts.map(([label, value], optionIndex) => `
          <label class="quiz-opt">
            <input type="radio" name="quiz_${question.key}" value="${value}" ${optionIndex === question.opts.length - 1 ? 'checked' : ''}>
            <span>${esc(label)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function quizSuggestion() {
  const values = {};
  let answered = 0;

  QUIZ.forEach((question) => {
    const picked = document.querySelector(`input[name="quiz_${question.key}"]:checked`);
    const value = picked ? Number(picked.value) : 2;
    values[question.key] = value;
    if (picked && value !== 2) answered += 1;
  });

  const scores = {};
  CRITERIA.forEach((criterion) => {
    const parts = QUIZ
      .filter((question) => question.criterion === criterion.key)
      .map((question) => values[question.key]);
    scores[criterion.key] = parts.length
      ? Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length)
      : 0;
  });

  const score = scoreOf({ scores });
  return { source: 'quiz', scores, score, cls: classify(score), answered };
}

function criteriaBarsHtml(scores, justificativas) {
  return CRITERIA.map((criterion) => {
    const value = Math.max(0, Math.min(5, Number(scores?.[criterion.key]) || 0));
    const points = Math.round((value / 5) * criterion.weight);
    const why = justificativas?.[criterion.key];

    return `<li class="bar-row">
      <span class="bar-label">${criterion.label}</span>
      <span class="bar-points"><b>${SCALE[value]}</b> · ${points}/${criterion.weight}</span>
      <span class="bar"><i style="width:${(value / 5) * 100}%"></i></span>
      ${why ? `<p class="assist-why">${esc(why)}</p>` : ''}
    </li>`;
  }).join('');
}

function renderAssistResult(suggestion) {
  const body = $('#assist-result-body');

  if (suggestion.source === 'quiz') {
    const contributions = CRITERIA.map((criterion) => ({
      ...criterion,
      points: Math.round(((Number(suggestion.scores[criterion.key]) || 0) / 5) * criterion.weight)
    }));
    const strongest = [...contributions].sort((a, b) => b.points - a.points).slice(0, 2);
    const weakest = [...contributions].sort((a, b) => a.points - b.points)[0];

    body.innerHTML = `
      <div class="assist-head">
        <div>
          <span class="assist-kicker">Sugestão pelas suas respostas</span>
          <h4>${suggestion.score} de 100 · ${suggestion.cls.label}</h4>
          <p>Calculada com os mesmos pesos do app.</p>
        </div>
        <div class="assist-score"><b>${suggestion.score}</b><span>de 100</span></div>
      </div>

      <p class="assist-cond">
        ${suggestion.answered === 0
          ? 'Você marcou “não sei” em todas as perguntas, então a nota ficou neutra. Responda o que souber para uma estimativa melhor.'
          : weakest.points === strongest[0].points
            ? 'As respostas ficaram equilibradas. Ajuste a condição real na ficha para deixar a nota mais precisa.'
            : `O que mais pesou: <b>${strongest.map((c) => c.label).join(' e ')}</b>. O que segurou a nota: <b>${weakest.label}</b>.`}
      </p>

      <ul class="bars" style="margin-top:14px">${criteriaBarsHtml(suggestion.scores)}</ul>

      <p class="assist-warn">Dá para ajustar tudo depois. Se alguma resposta não bater com a peça, volte e refaça as perguntas.</p>
    `;
  } else {
    const entry = suggestion.entry;
    const meta = [entry.anos, entry.movimento].filter(Boolean);

    body.innerHTML = `
      <div class="assist-head">
        <div>
          <span class="assist-kicker">Sugestão pela marca e referência</span>
          <h4>${esc(suggestion.marca)} ${esc(suggestion.modelo)}</h4>
          ${meta.length ? `<p>${meta.map((m) => esc(m)).join(' · ')}</p>` : ''}
        </div>
        <div class="assist-score"><b>${suggestion.score}</b><span>de 100</span></div>
      </div>

      <dl class="ref-tech">
        <div><dt>Produção</dt><dd>${esc(entry.producao || 'Não informada')}</dd></div>
        <div><dt>Referências</dt><dd>${esc((entry.refs || []).join(', ') || 'Não informadas')}</dd></div>
        <div><dt>Condição</dt><dd>Comecei com média (3 de 5). Ajuste conforme a peça real.</dd></div>
      </dl>

      <ul class="bars" style="margin-top:14px">${criteriaBarsHtml(suggestion.scores)}</ul>

      <p class="panel-title" style="margin-top:18px">O que conferir na peça</p>
      <ul class="ref-tips">${(entry.dicas || []).map((tip) => `<li>${esc(tip)}</li>`).join('')}</ul>

      ${entry.aviso ? `<p class="assist-warn">${esc(entry.aviso)}</p>` : ''}
      <p class="assist-warn">A nota é uma estimativa para o modelo. A condição, a originalidade e a procedência variam de peça para peça.</p>
    `;
  }

  state.assistSuggestion = suggestion;
  showAssistView('result');
}

function setRefStatus(message, isError) {
  const status = $('#assist-ref-status');
  if (!status) return;
  status.innerHTML = message || '';
  status.style.color = isError ? 'var(--danger)' : '';
}

function normText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenList(value) {
  const text = normText(value);
  return text ? text.split(' ') : [];
}

function referenceScores(entry) {
  const scores = {};
  CRITERIA.forEach((criterion) => {
    const index = REF_INDEX[criterion.key];
    const value = Number(entry?.scores?.[index]);
    scores[criterion.key] = Number.isFinite(value) ? Math.max(0, Math.min(5, Math.round(value))) : 0;
  });
  return scores;
}

function findReference(marcaQuery, modeloQuery) {
  const brandQ = normText(marcaQuery);
  const modelQ = normText(modeloQuery);
  const modelTokens = tokenList(modeloQuery);

  return REFERENCE.map((entry, index) => {
    const aliases = [entry.marca].concat(entry.alias || []).map(normText);
    let score = 0;

    if (brandQ) {
      if (aliases.includes(brandQ)) score += 40;
      else if (aliases.some((alias) => alias.startsWith(brandQ) || brandQ.startsWith(alias))) score += 26;
      else return null;
    }

    if (modelQ) {
      const refs = (entry.refs || []).map(normText);
      const modelText = normText([entry.modelo].concat(entry.refs || []).join(' '));
      let modelScore = 0;

      if (refs.includes(modelQ)) modelScore += 60;
      else if (refs.some((ref) => modelQ.includes(ref) || ref.includes(modelQ))) modelScore += 38;
      if (modelText.includes(modelQ)) modelScore += 20;
      modelScore += modelTokens.filter((token) => token.length >= 3 && modelText.includes(token)).length * 7;

      if (!modelScore) return null;
      score += modelScore;
    }

    return score > 0 ? { entry, index, points: score } : null;
  })
    .filter(Boolean)
    .sort((a, b) => b.points - a.points)
    .slice(0, 6);
}

function renderRefMatches(matches) {
  const box = $('#assist-ref-results');
  if (!box) return;

  state.assistMatches = matches.map((match) => match.entry);

  box.innerHTML = `<div class="ref-list">${matches.map(({ entry }, index) => {
    const scores = referenceScores(entry);
    const score = scoreOf({ scores });
    const cls = classify(score);
    return `<button class="assist-option" type="button" data-ref-index="${index}">
      <strong>${esc(entry.marca)} ${esc(entry.modelo)}</strong>
      <span class="ref-meta"><span>${esc(entry.anos)}</span><span>${esc(entry.movimento)}</span></span>
      <span class="ref-meta"><span class="ref-score">Nota estimada ${score}/100 · ${cls.label}</span></span>
    </button>`;
  }).join('')}</div>`;
}

function searchReference() {
  const marca = $('#assist-marca')?.value.trim() || '';
  const modelo = $('#assist-modelo')?.value.trim() || '';

  if (!marca && !modelo) {
    setRefStatus('Digite pelo menos a marca ou o modelo/referência.', true);
    $('#assist-marca')?.focus();
    return;
  }

  const matches = findReference(marca, modelo);

  if (!matches.length) {
    state.assistMatches = [];
    $('#assist-ref-results').innerHTML = '';
    setRefStatus('Ainda não tenho esse modelo na base. Tente só a marca ou use as perguntas simples.', true);
    return;
  }

  setRefStatus(`${matches.length} modelo(s) encontrado(s). Escolha o mais parecido com a sua peça.`, false);
  renderRefMatches(matches);
}

function openRefSuggestion(index) {
  const entry = state.assistMatches[index];
  if (!entry) return;

  const scores = referenceScores(entry);
  const score = scoreOf({ scores });

  renderAssistResult({
    source: 'ref',
    entry,
    marca: entry.marca,
    modelo: entry.modelo,
    referencia: (entry.refs || [])[0] || '',
    movimento: entry.movimento,
    scores,
    score,
    cls: classify(score)
  });
}

function applyAssistSuggestion() {
  const suggestion = state.assistSuggestion;
  if (!suggestion) return;

  if (suggestion.source === 'ref') {
    if (!strVal('f-marca') && suggestion.marca) setVal('f-marca', suggestion.marca);
    if (!strVal('f-modelo') && suggestion.modelo) setVal('f-modelo', suggestion.modelo);
    if (!strVal('f-referencia') && suggestion.referencia) setVal('f-referencia', suggestion.referencia);
    if (!strVal('f-movimento') && suggestion.movimento) setVal('f-movimento', suggestion.movimento);
  }

  document.querySelectorAll('#criteria-list input[type="range"]').forEach((input) => {
    const value = Number(suggestion.scores?.[input.dataset.key]);
    input.value = Number.isFinite(value) ? value : 0;
  });

  syncCriteriaLabels();
  updateLiveScore();
  $('#assist-dialog').close();
  toast('Sugestão aplicada — revise e salve.');
  $('#live-score').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------------- instalação PWA ---------------- */

let deferredPrompt = null;

function setupInstall() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    $('#btn-install').hidden = false;
  });

  $('#btn-install').addEventListener('click', async () => {
    if (!deferredPrompt) {
      toast('No celular: menu do navegador → “Adicionar à tela inicial”.');
      return;
    }
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (e) { /* ignorado */ }
    deferredPrompt = null;
    $('#btn-install').hidden = true;
    closeDialogs();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    $('#btn-install').hidden = true;
    toast('App instalado no aparelho.');
  });
}

/* ---------------- eventos ---------------- */

function bindEvents() {
  $('#search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderList();
  });

  $('#sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderList();
  });

  $('#filter-chips').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    state.filter = chip.dataset.filter;
    renderList();
  });

  $('#top-search').addEventListener('input', (e) => {
    state.topQuery = e.target.value;
    renderTop100();
  });

  $('#top-brand').addEventListener('change', (e) => {
    state.topBrand = e.target.value;
    renderTop100();
  });

  $('#top-list').addEventListener('click', (e) => {
    const use = e.target.closest('[data-top-use]');
    if (use) {
      startFromRanking(use.dataset.topUse);
      return;
    }

    const toggle = e.target.closest('[data-top-toggle]');
    if (!toggle) return;
    const item = toggle.closest('.top-item');
    const detail = item?.querySelector('.top-detail');
    if (!detail) return;
    const open = detail.hidden;
    detail.hidden = !open;
    item.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  $('#btn-share-top').addEventListener('click', copyTopLink);
  $('#btn-top100-menu').addEventListener('click', () => {
    closeDialogs();
    location.hash = '#/top100';
  });

  $('#detail').addEventListener('click', (e) => {
    if (e.target.closest('#btn-print')) { window.print(); return; }

    if (e.target.closest('#btn-story-add') || e.target.closest('#btn-story-edit')) {
      const id = decodeURIComponent(location.hash.replace(/^#\/peca\//, ''));
      const watch = state.watches.find((w) => w.id === id);
      if (watch) openStoryEditor({ watch, lockWatch: true });
      return;
    }

    const storyPhoto = e.target.closest('[data-story-photo-index]');
    if (storyPhoto) {
      const id = decodeURIComponent(location.hash.replace(/^#\/peca\//, ''));
      const watch = state.publicWatch || state.watches.find((w) => w.id === id);
      const photo = watch?.historia?.photos?.[Number(storyPhoto.dataset.storyPhotoIndex)];
      if (photo) openPhotoDialog(photo, `Foto da história de ${watch.marca} ${watch.modelo}`);
      return;
    }

    if (e.target.closest('#btn-save-public')) {
      savePublicToCollection();
      return;
    }

    if (e.target.closest('#btn-share')) {
      const id = decodeURIComponent(location.hash.replace(/^#\/peca\//, ''));
      const watch = state.watches.find((w) => w.id === id);
      if (watch) openShare(watch);
      return;
    }

    if (e.target.closest('#btn-delete')) {
      const path = location.hash.replace(/^#\/peca\//, '');
      const id = decodeURIComponent(path);
      const watch = state.watches.find((w) => w.id === id);
      if (!watch) return;
      const ok = window.confirm(`Excluir “${watch.marca} ${watch.modelo}” do catálogo?`);
      if (!ok) return;
      state.watches = state.watches.filter((w) => w.id !== id);
      persist();
      toast('Peça excluída.');
      location.hash = '#/';
    }
  });

  $('#criteria-list').addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"]')) {
      syncCriteriaLabels();
      updateLiveScore();
    }
  });

  $('#f-neg-ativa').addEventListener('change', (e) => {
    $('#neg-fields').classList.toggle('hidden', !e.target.checked);
  });

  $('#f-photo').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Escolha um arquivo de imagem.');
      return;
    }
    try {
      state.photo = await compressImage(file);
      updatePhotoPreview();
    } catch (err) {
      toast('Não foi possível ler essa imagem.');
    }
    e.target.value = '';
  });

  $('#btn-remove-photo').addEventListener('click', () => {
    state.photo = null;
    updatePhotoPreview();
  });

  $('#btn-cancel').addEventListener('click', () => {
    if (state.editingId) location.hash = `#/peca/${encodeURIComponent(state.editingId)}`;
    else location.hash = state.formReturn || '#/';
  });

  $('#watch-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectForm();

    if (!data.marca || !data.modelo) {
      toast('Informe pelo menos marca e modelo.');
      return;
    }

    let id;

    if (state.editingId) {
      const index = state.watches.findIndex((w) => w.id === state.editingId);
      const previous = state.watches[index];
      const merged = normalize({
        ...previous,
        ...data,
        id: previous.id,
        criadoEm: previous.criadoEm,
        atualizadoEm: Date.now()
      });
      state.watches[index] = merged;
      id = merged.id;
      toast('Avaliação atualizada.');
    } else {
      const created = normalize({ ...data, atualizadoEm: Date.now(), criadoEm: Date.now() });
      created.id = uid();
      state.watches.push(created);
      id = created.id;
      toast('Relógio adicionado ao catálogo.');
    }

    persist();
    state.editingId = null;
    const target = `#/peca/${encodeURIComponent(id)}`;
    if (location.hash === target) route();
    else location.hash = target;
  });

  $('#btn-menu').addEventListener('click', () => {
    const demoBtn = $('#btn-demo');
    demoBtn.hidden = !state.watches.some((w) => w.exemplo);
    openDialog($('#menu-dialog'));
  });

  document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('dialog')?.close());
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });

  $('#btn-copy-link').addEventListener('click', copyShareLink);
  $('#btn-download-ficha').addEventListener('click', downloadFichaHtml);
  $('#btn-native-share').addEventListener('click', nativeShare);

  let authorTimer = null;
  $('#share-author').addEventListener('input', () => {
    clearTimeout(authorTimer);
    authorTimer = setTimeout(refreshShareLink, 450);
  });

  $('#btn-assist').addEventListener('click', openAssist);

  document.querySelectorAll('[data-assist-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.assistMode === 'ref') {
        fillRefInputs();
        showAssistView('ref');
        $('#assist-marca')?.focus();
      } else {
        renderQuiz();
        showAssistView('quiz');
      }
    });
  });

  document.querySelectorAll('[data-assist-back]').forEach((button) => {
    button.addEventListener('click', () => showAssistView('home'));
  });

  $('#btn-ref-search').addEventListener('click', searchReference);
  $('#assist-ref-results').addEventListener('click', (event) => {
    const button = event.target.closest('[data-ref-index]');
    if (button) openRefSuggestion(Number(button.dataset.refIndex));
  });
  ['#assist-marca', '#assist-modelo'].forEach((selector) => {
    $(selector).addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchReference();
      }
    });
  });
  $('#btn-quiz-run').addEventListener('click', () => renderAssistResult(quizSuggestion()));
  $('#btn-assist-apply').addEventListener('click', applyAssistSuggestion);

  $('#btn-assist-menu').addEventListener('click', () => {
    closeDialogs();
    if ($('#form-view').classList.contains('is-active')) {
      openAssist();
      return;
    }
    state.assistPending = true;
    if (location.hash === '#/nova') route();
    else location.hash = '#/nova';
  });

  $('#btn-about').addEventListener('click', () => {
    closeDialogs();
    openDialog($('#about-dialog'));
  });

  $('#btn-export').addEventListener('click', () => {
    exportBackup();
    closeDialogs();
  });

  $('#btn-import').addEventListener('click', () => {
    closeDialogs();
    $('#import-file').click();
  });

  $('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : data?.watches;
      if (!Array.isArray(items) || !items.length) throw new Error('vazio');
      if (!window.confirm(`Importar ${items.length} peça(s)? Peças com o mesmo ID serão atualizadas.`)) return;
      mergeImport(items);
    } catch (err) {
      toast('Arquivo inválido. Use um backup exportado pelo app.');
    }
  });

  $('#btn-demo').addEventListener('click', () => {
    const count = state.watches.filter((w) => w.exemplo).length;
    if (!count) { toast('Nenhuma peça de exemplo.'); return; }
    state.watches = state.watches.filter((w) => !w.exemplo);
    persist();
    renderList();
    closeDialogs();
    toast(`${count} peça(s) de exemplo removida(s).`);
  });

  bindHistoryEvents();
  bindTimeEvents();
  bindAuthEvents();

  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close-dialog]');
    if (close) close.closest('dialog')?.close();
  });
}

/* ---------------- service worker ---------------- */

function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(location.protocol)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  });
}

/* ---------------- início ---------------- */

function init() {
  loadData();
  buildCriteriaForm();
  buildAbout();
  bindEvents();
  setupInstall();
  setupServiceWorker();

  if (!location.hash) {
    history.replaceState(null, '', '#/');
  }

  route();
  window.addEventListener('hashchange', route);
}

init();
