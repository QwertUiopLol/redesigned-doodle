import { Engine } from './core/engine.js';
import naturalSemiring from './libraries/natural-semiring.js';

// Все предметные теории перечисляются здесь. UI не импортирует их API напрямую:
// он знает только об идентификаторе и о методе install у модуля.
const libraries = [naturalSemiring];
const engine = new Engine();

const cells = document.querySelector('#cells');
const status = document.querySelector('#status');

const initialCells = [
  '# Теория натуральных чисел использует Peano-термы, а не JS-числа.',
  ':load natural-semiring',
  '# add(0, b) = b; add(succ(a), b) = succ(add(a, b))',
  'let five = nat.add(nat.two, nat.three)',
  'nat.mul(five, nat.two)',
  'theorem two_times_five: nat.mul(nat.two, five) = nat.add(five, five)',
  'nat.sub(nat.two, nat.three)',
];

function autoSize(input) {
  input.style.height = '0';
  input.style.height = `${Math.max(36, input.scrollHeight)}px`;
}

function renumber() {
  cells.querySelectorAll('.line-no').forEach((lineNumber, index) => {
    lineNumber.textContent = index + 1;
  });
}

function addCell(value = '') {
  const row = document.createElement('div');
  row.className = 'cell';
  row.innerHTML = `
    <span class="line-no"></span>
    <div class="cell-body">
      <textarea class="source" spellcheck="false" rows="1"></textarea>
      <output class="result"></output>
    </div>`;

  const input = row.querySelector('.source');
  input.value = value;
  input.addEventListener('input', () => autoSize(input));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      run();
    }
  });

  cells.append(row);
  autoSize(input);
  renumber();
  return input;
}

function renderLibraries() {
  const list = document.querySelector('#library-list');
  list.innerHTML = libraries.map((library) => `
    <label class="library-item">
      <input type="checkbox" data-module="${library.id}">
      ${library.label}
    </label>`).join('');

  // Галочка — быстрый способ загрузить модуль; снятие пока не выгружает модуль,
  // потому что следующий запуск всё равно начинает с чистого Engine.
  list.addEventListener('change', run);
}

function setMetrics() {
  document.querySelector('#definition-count').textContent = engine.values.size;
  document.querySelector('#proof-count').textContent = engine.proofs.length;
  document.querySelector('#module-count').textContent = engine.modules.size;
}

function load(id) {
  const library = libraries.find((item) => item.id === id);
  if (!library) throw Error(`модуль «${id}» не найден`);

  if (!engine.modules.has(id)) {
    library.install(engine);
    engine.modules.add(id);
  }

  const checkbox = document.querySelector(`[data-module="${id}"]`);
  if (checkbox) checkbox.checked = true;
}

function runLine(text) {
  const source = text.trim();
  if (!source || source.startsWith('#')) return '';

  if (source.startsWith(':load ')) {
    const moduleId = source.slice(6).trim();
    load(moduleId);
    return `подключен модуль ${moduleId}`;
  }

  const definition = source.match(/^let\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);
  if (definition) {
    const [, name, expression] = definition;
    const value = engine.define(name, expression);
    return `${name} := ${engine.formatValue(value)}`;
  }

  const theorem = source.match(/^theorem\s+([A-Za-z_]\w*)\s*:\s*(.+)$/);
  if (theorem) {
    const [, name, proposition] = theorem;
    if (!engine.prove(name, proposition)) throw Error(`теорема ${name} не доказана`);
    return `✓ ${name} доказана вычислением`;
  }

  return `= ${engine.formatValue(engine.expression(source))}`;
}

function run() {
  // Запуск детерминирован: все прошлые определения отбрасываются, затем строки
  // выполняются строго сверху вниз. Это делает тетрадь воспроизводимой.
  engine.reset();
  let failed = false;

  cells.querySelectorAll('.cell').forEach((row) => {
    const result = row.querySelector('.result');
    result.textContent = '';
    result.className = 'result';

    try {
      const output = runLine(row.querySelector('.source').value);
      result.textContent = output;
      if (output.startsWith('✓')) result.classList.add('proof');
    } catch (error) {
      failed = true;
      result.textContent = `ошибка: ${error.message}`;
      result.classList.add('error');
    }
  });

  setMetrics();
  status.textContent = failed ? 'ЕСТЬ ОШИБКИ' : 'ГОТОВ';
  status.classList.toggle('error', failed);
  document.querySelector('#footer-message').textContent = failed
    ? 'проверьте отмеченные строки'
    : 'вычислено успешно';
}

document.querySelector('#run-button').addEventListener('click', run);
document.querySelector('#add-cell').addEventListener('click', () => addCell('').focus());
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    run();
  }
});

renderLibraries();
initialCells.forEach(addCell);
run();
