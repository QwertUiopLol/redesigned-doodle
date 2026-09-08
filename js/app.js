import { Engine } from './core/engine.js';
import naturals from './libraries/naturals.js';

const libraries = [naturals]; const engine = new Engine();
const cells = document.querySelector('#cells'), status = document.querySelector('#status');
const initial = ['# Добро пожаловать в axiom', ':load naturals', 'let n = two + 3', 'n * 4', 'theorem four_times_five: 4 * 5 = 20'];

function autoSize(input) { input.style.height = '0'; input.style.height = `${Math.max(35, input.scrollHeight)}px`; }
function addCell(value = '') {
  const row = document.createElement('div'); row.className = 'cell';
  row.innerHTML = '<span class="line-no"></span><div class="cell-body"><textarea class="source" spellcheck="false" rows="1"></textarea><output class="result"></output></div>';
  const input = row.querySelector('.source'); input.value = value; input.addEventListener('input', () => autoSize(input)); input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); run(); } }); cells.append(row); autoSize(input); renumber(); return input;
}
function renumber() { cells.querySelectorAll('.line-no').forEach((item, i) => item.textContent = i + 1); }
function renderLibraries() { const list = document.querySelector('#library-list'); list.innerHTML = libraries.map(lib => `<label class="library-item"><input type="checkbox" data-module="${lib.id}"> ${lib.label}</label>`).join(''); list.addEventListener('change', run); }
function setMetrics() { document.querySelector('#definition-count').textContent = engine.values.size; document.querySelector('#proof-count').textContent = engine.proofs.length; document.querySelector('#module-count').textContent = engine.modules.size; }
function load(id) { const lib = libraries.find(item => item.id === id); if (!lib) throw Error(`модуль «${id}» не найден`); if (!engine.modules.has(id)) { lib.install(engine); engine.modules.add(id); } const box = document.querySelector(`[data-module="${id}"]`); if (box) box.checked = true; }
function runLine(text) {
  const source = text.trim(); if (!source || source.startsWith('#')) return '';
  if (source.startsWith(':load ')) { load(source.slice(6).trim()); return `подключен модуль ${source.slice(6).trim()}`; }
  const definition = source.match(/^let\s+([A-Za-z_]\w*)\s*=\s*(.+)$/); if (definition) return `${definition[1]} := ${engine.define(definition[1], definition[2])}`;
  const theorem = source.match(/^theorem\s+([A-Za-z_]\w*)\s*:\s*(.+)$/); if (theorem) { if (!engine.prove(theorem[1], theorem[2])) throw Error(`теорема ${theorem[1]} не доказана`); return `✓ ${theorem[1]} доказана`; }
  return `= ${engine.expression(source)}`;
}
function run() { engine.reset(); let failed = false; cells.querySelectorAll('.cell').forEach(row => { const result = row.querySelector('.result'); result.textContent = ''; result.className = 'result'; try { const output = runLine(row.querySelector('.source').value); result.textContent = output; if (output.startsWith('✓')) result.classList.add('proof'); } catch (error) { failed = true; result.textContent = `ошибка: ${error.message}`; result.classList.add('error'); } }); setMetrics(); status.textContent = failed ? 'ЕСТЬ ОШИБКИ' : 'ГОТОВ'; status.classList.toggle('error', failed); document.querySelector('#footer-message').textContent = failed ? 'проверьте отмеченные строки' : 'вычислено успешно'; }
document.querySelector('#run-button').addEventListener('click', run); document.querySelector('#add-cell').addEventListener('click', () => addCell('').focus()); document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); run(); } });
renderLibraries(); initial.forEach(addCell); run();
