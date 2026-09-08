import { evaluate } from '../core/evaluator.js';
import { check } from '../modules/two_checker.js';

/** Управляет только DOM ячеек; математика остаётся в core/evaluator.js. */
export function createNotebook({ root, template }) {
  const history = []; let historyIndex = 0;

  function addCell(initialValue = '') {
    const cell = template.content.firstElementChild.cloneNode(true);
    const input = cell.querySelector('.expression-input');
    const output = cell.querySelector('.cell-output');
    input.value = initialValue;
    const run = () => {
      try {
        const isStatement = input.value.includes('=');
        const result = isStatement ? check(input.value) : { left: evaluate(input.value) };
        output.textContent = isStatement
          ? (result.valid ? `верно  (${result.left} = ${result.right})` : `неверно  (${result.left} ≠ ${result.right})`)
          : String(result.left);
        output.classList.toggle('invalid', isStatement && !result.valid);
        output.classList.remove('error');
        if (history.at(-1) !== input.value) history.push(input.value);
        historyIndex = history.length;
      } catch (error) { output.textContent = error.message; output.classList.add('error'); output.classList.remove('invalid'); }
    };
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); run(); }
      if (event.key === 'ArrowUp' && history.length) { event.preventDefault(); historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex]; }
      if (event.key === 'ArrowDown' && history.length) { event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] ?? ''; }
    });
    cell.querySelector('.remove-cell').addEventListener('click', () => cell.remove());
    root.append(cell); input.focus();
  }

  return { addCell, clear: () => { root.replaceChildren(); addCell('12 + 7 = 19'); } };
}
