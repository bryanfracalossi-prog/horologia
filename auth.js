'use strict';

/* ============================================================
   Horologia — check-up de autenticidade
   Roteiro de inspeção visual. Não emite laudo nem confirma
   autenticidade. Funciona offline, sem IA e sem envio de fotos.
   ============================================================ */

const AUTH_CHECKS = [
  {
    id: 'dial',
    title: 'Mostrador e impressão',
    hint: 'Veja se o logo, as escalas e os textos estão nítidos, alinhados e coerentes com o ano da peça. Compare com fotos oficiais da mesma versão.'
  },
  {
    id: 'hands',
    title: 'Ponteiros e lumen',
    hint: 'Ponteiros, acabamento e cor do lumen devem combinar entre si e com o mostrador. Ponteiros de época errada são um alerta.'
  },
  {
    id: 'case',
    title: 'Caixa e gravações',
    hint: 'Confira referência, número de série, formato das alças e acabamento. Gravações borradas, refundidas ou com fonte errada acendem alerta.'
  },
  {
    id: 'crown',
    title: 'Coroa e tubo',
    hint: 'A coroa deve ter o logo e a rosca corretos, girar com firmeza e encaixar sem folga. Veja se o formato combina com o modelo.'
  },
  {
    id: 'bezel',
    title: 'Bisel ou luneta',
    hint: 'Insert, encaixe e alinhamento precisam ser compatíveis com o modelo. Peças aftermarket e inserts trocados são comuns.'
  },
  {
    id: 'bracelet',
    title: 'Bracelete, pulseira e fecho',
    hint: 'Códigos, acabamento, flexão e assinatura do fecho devem ser coerentes com a caixa e com a época. Confira os elos e o fecho por dentro.'
  },
  {
    id: 'movement',
    title: 'Movimento',
    hint: 'Se for seguro abrir, confira acabamento, gravações e número do calibre. Não abra peças lacradas, frágeis ou de alto valor sem um profissional.'
  },
  {
    id: 'crystal',
    title: 'Vidro, lupa e alinhamento',
    hint: 'Formato, altura, ciclope e alinhamento variam por época. Um vidro ou lupa errados podem indicar troca ou montagem incorreta.'
  },
  {
    id: 'documents',
    title: 'Documentos e procedência',
    hint: 'Caixa, garantia, nota e histórico de manutenção ajudam, mas não provam autenticidade sozinhos. Confira se os dados batem com a peça.'
  },
  {
    id: 'seller',
    title: 'Preço e história do vendedor',
    hint: 'Desconto muito fora do mercado, pressa para vender, recusa de fotos macro ou história que muda são sinais de alerta. Pesquise antes de pagar.'
  }
];

let authPhotos = [];
let authChecked = new Set();
let authEntries = [];
let authEntryIndex = 0;
let authWatch = null;

function authContext() {
  if ($('#form-view')?.classList.contains('is-active')) {
    return {
      source: 'form',
      watch: {
        marca: strVal('f-marca'),
        modelo: strVal('f-modelo'),
        referencia: strVal('f-referencia'),
        photo: state.photo || null
      }
    };
  }

  if (location.hash.startsWith('#/peca/')) {
    const id = decodeURIComponent(location.hash.replace(/^#\/peca\//, ''));
    return { source: 'detail', watch: state.watches.find((watch) => watch.id === id) || null };
  }

  if (location.hash.startsWith('#/v/')) {
    return { source: 'public', watch: state.publicWatch || null };
  }

  return { source: 'menu', watch: null };
}

function authModelInput(watch) {
  const modelo = String(watch?.modelo || '').trim();
  const referencia = String(watch?.referencia || '').trim();
  if (!referencia) return modelo;
  if (modelo.toLowerCase().includes(referencia.toLowerCase())) return modelo;
  return [modelo, referencia].filter(Boolean).join(' ');
}

function openAuthDialog() {
  const context = authContext();
  authWatch = context.watch;
  authPhotos = [];
  authChecked = new Set();
  authEntries = [];
  authEntryIndex = 0;

  if (authWatch?.photo) authPhotos.push({ src: authWatch.photo, label: 'Foto da ficha' });

  const marcaInput = $('#auth-marca');
  const modeloInput = $('#auth-modelo');
  if (marcaInput) marcaInput.value = authWatch?.marca || '';
  if (modeloInput) modeloInput.value = authModelInput(authWatch);

  const box = $('#auth-model-box');
  if (box) {
    box.hidden = true;
    box.innerHTML = '';
  }

  authRenderPhotos();
  authRenderChecklist();
  openDialog($('#auth-dialog'));

  if (authWatch?.marca || authWatch?.modelo) authSearchModel(true);
}

function authSearchModel(silent = false) {
  const marca = $('#auth-marca')?.value.trim() || '';
  const modelo = $('#auth-modelo')?.value.trim() || '';

  if (!marca && !modelo) {
    if (!silent) toast('Digite a marca ou o modelo/referência.');
    return;
  }

  const matches = findReference(marca, modelo);
  const box = $('#auth-model-box');
  if (!box) return;

  authEntries = matches.map((match) => match.entry);
  authEntryIndex = 0;

  if (!authEntries.length) {
    box.hidden = false;
    box.innerHTML = '<p class="hint">Modelo não encontrado na base offline. Use o roteiro geral abaixo e confirme os detalhes com um especialista.</p>';
    return;
  }

  box.hidden = false;
  authRenderModelBox();
}

function authRenderModelBox() {
  const entry = authEntries[authEntryIndex];
  if (!entry) return;

  const box = $('#auth-model-box');
  if (!box) return;

  const options = authEntries.length > 1
    ? `<label class="field"><span>Modelo encontrado</span>
        <select id="auth-model-select">
          ${authEntries.map((item, index) => `<option value="${index}"${index === authEntryIndex ? ' selected' : ''}>${esc(item.marca)} ${esc(item.modelo)}</option>`).join('')}
        </select>
      </label>`
    : '';

  const tips = (entry.dicas || []).map((tip) => `<li>${esc(tip)}</li>`).join('');
  const aviso = entry.aviso
    ? `<p class="auth-alert"><strong>Atenção:</strong> ${esc(entry.aviso)}</p>`
    : '';

  box.innerHTML = `
    <div class="auth-model-head">
      <span class="history-eyebrow">Pontos específicos</span>
      <h4>${esc(entry.marca)} ${esc(entry.modelo)}</h4>
      <p class="hint">${esc(entry.anos || '')}${entry.movimento ? ` · ${esc(entry.movimento)}` : ''}</p>
    </div>
    ${options}
    ${aviso}
    ${tips ? `<ul class="auth-tips">${tips}</ul>` : ''}
    <p class="hint">Compare estes pontos com fotos oficiais da versão e do ano. A base é um apoio, não uma confirmação.</p>
  `;

  const select = $('#auth-model-select');
  if (select) {
    select.value = String(authEntryIndex);
    select.addEventListener('change', () => {
      authEntryIndex = Number(select.value) || 0;
      authRenderModelBox();
    });
  }
}

function authRenderPhotos() {
  const grid = $('#auth-photo-grid');
  if (!grid) return;

  if (!authPhotos.length) {
    grid.innerHTML = '<p class="hint auth-photo-empty">Nenhuma foto adicionada. Use o botão acima para começar a inspeção.</p>';
    return;
  }

  grid.innerHTML = authPhotos.map((photo, index) => `
    <div class="auth-photo">
      <button class="auth-photo-view" type="button" data-auth-photo="${index}" aria-label="Ampliar foto">
        <img src="${esc(photo.src)}" alt="${esc(photo.label)}">
      </button>
      <button class="auth-photo-remove" type="button" data-auth-photo-remove="${index}" aria-label="Remover foto">✕</button>
      <span>${esc(photo.label)}</span>
    </div>
  `).join('');
}

function authRenderChecklist() {
  const list = $('#auth-checklist');
  if (!list) return;

  list.innerHTML = AUTH_CHECKS.map((item) => {
    const checked = authChecked.has(item.id);
    return `<label class="auth-check${checked ? ' is-checked' : ''}">
      <input type="checkbox" data-auth-check="${esc(item.id)}"${checked ? ' checked' : ''}>
      <span>
        <strong>${esc(item.title)}</strong>
        <small>${esc(item.hint)}</small>
      </span>
    </label>`;
  }).join('');

  authUpdateCount();
}

function authUpdateCount() {
  const count = $('#auth-check-count');
  if (count) count.textContent = `${authChecked.size} de ${AUTH_CHECKS.length} conferidos`;
}

async function authHandlePhotos(event) {
  const input = event.target;
  const files = Array.from(input.files || []);
  input.value = '';

  if (!files.length) return;

  const room = 6 - authPhotos.length;
  if (room <= 0) {
    toast('Limite de 6 fotos para o check-up.');
    return;
  }

  let added = 0;
  for (const file of files.slice(0, room)) {
    if (!file.type.startsWith('image/')) continue;
    try {
      const src = await compressFile(file, 1400, 0.8, '#f6e7bd');
      const label = file.name.replace(/\.[^.]+$/, '').slice(0, 42) || 'Foto';
      authPhotos.push({ src, label });
      added += 1;
    } catch (e) { /* foto ignorada */ }
  }

  authRenderPhotos();
  if (added) toast(`${added} foto(s) adicionada(s) só para esta inspeção.`);
  else toast('Não foi possível adicionar as fotos.');
}

async function authCopyScript() {
  const piece = [$('#auth-marca')?.value.trim(), $('#auth-modelo')?.value.trim()].filter(Boolean).join(' ');
  const lines = [
    'CHECK-UP DE AUTENTICIDADE — Horologia',
    'Roteiro de inspeção visual. Não é laudo e não confirma autenticidade.',
    '',
    `Peça: ${piece || 'não informada'}`,
    ''
  ];

  const checked = AUTH_CHECKS.filter((item) => authChecked.has(item.id));
  const pending = AUTH_CHECKS.filter((item) => !authChecked.has(item.id));

  if (checked.length) {
    lines.push('Já conferido:');
    checked.forEach((item) => lines.push(`- ${item.title}`));
    lines.push('');
  }

  if (pending.length) {
    lines.push('Ainda conferir:');
    pending.forEach((item) => lines.push(`- ${item.title}: ${item.hint}`));
    lines.push('');
  }

  const entry = authEntries[authEntryIndex];
  if (entry) {
    lines.push(`Pontos específicos de ${entry.marca} ${entry.modelo}:`);
    (entry.dicas || []).forEach((tip) => lines.push(`- ${tip}`));
    if (entry.aviso) lines.push(`Atenção: ${entry.aviso}`);
    lines.push('');
  }

  lines.push('Sinais de alerta: preço muito baixo, vendedor evasivo, referência/série inconsistentes, texto torto ou borrado, peças de versões misturadas, caixa refundida, movimento errado e documentos duvidosos.');
  lines.push('Em peças de alto valor, procure um relojoeiro ou especialista antes de comprar.');

  const text = lines.join('\n');

  try {
    await navigator.clipboard.writeText(text);
    toast('Roteiro copiado.');
    return;
  } catch (e) { /* tenta o método antigo */ }

  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  try {
    const copied = document.execCommand('copy');
    toast(copied ? 'Roteiro copiado.' : 'Não foi possível copiar o roteiro.');
  } catch (e) {
    toast('Não foi possível copiar o roteiro.');
  }
  field.remove();
}

function bindAuthEvents() {
  $('#btn-auth-menu')?.addEventListener('click', () => {
    closeDialogs();
    openAuthDialog();
  });

  $('#btn-auth-form')?.addEventListener('click', openAuthDialog);

  $('#detail')?.addEventListener('click', (event) => {
    if (event.target.closest('#btn-auth-detail')) openAuthDialog();
  });

  $('#btn-auth-search')?.addEventListener('click', () => authSearchModel());

  ['#auth-marca', '#auth-modelo'].forEach((selector) => {
    $(selector)?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        authSearchModel();
      }
    });
  });

  $('#auth-photo-input')?.addEventListener('change', authHandlePhotos);

  $('#auth-photo-grid')?.addEventListener('click', (event) => {
    const view = event.target.closest('[data-auth-photo]');
    if (view) {
      const photo = authPhotos[Number(view.dataset.authPhoto)];
      if (photo) openPhotoDialog(photo.src, photo.label || 'Foto do check-up');
      return;
    }

    const remove = event.target.closest('[data-auth-photo-remove]');
    if (remove) {
      authPhotos.splice(Number(remove.dataset.authPhotoRemove), 1);
      authRenderPhotos();
    }
  });

  $('#auth-checklist')?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-auth-check]');
    if (!input) return;
    if (input.checked) authChecked.add(input.dataset.authCheck);
    else authChecked.delete(input.dataset.authCheck);
    input.closest('.auth-check')?.classList.toggle('is-checked', input.checked);
    authUpdateCount();
  });

  $('#btn-auth-copy')?.addEventListener('click', authCopyScript);

  $('#auth-dialog')?.addEventListener('close', () => {
    authPhotos = [];
    authChecked = new Set();
    authEntries = [];
    authEntryIndex = 0;
    authWatch = null;

    const box = $('#auth-model-box');
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
    authRenderPhotos();
    authRenderChecklist();
  });
}
