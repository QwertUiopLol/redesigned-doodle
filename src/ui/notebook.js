import { evaluate } from '../core/evaluator.js';

/** Управляет только DOM ячеек; математика остаётся в core/evaluator.js. */
export function createNotebook({ root, template, registry }) {
  const history = []; let historyIndex = 0;

  function addCell(initialValue = '') {
    const cell = template.content.firstElementChild.cloneNode(true);
    const input = cell.querySelector('.expression-input');
    const output = cell.querySelector('.cell-output');
    input.value = initialValue;
    const run = () => {
      try {
        const value = evaluate(input.value, registry);
        output.textContent = Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
        output.classList.remove('error');
        if (history.at(-1) !== input.value) history.push(input.value);
        historyIndex = history.length;
      } catch (error) { output.textContent = error.message; output.classList.add('error'); }
    };
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); run(); }
      if (event.key === 'ArrowUp' && history.length) { event.preventDefault(); historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex]; }
      if (event.key === 'ArrowDown' && history.length) { event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] ?? ''; }
    });
    cell.querySelector('.remove-cell').addEventListener('click', () => cell.remove());
    root.append(cell); input.focus();
  }

  return { addCell, clear: () => { root.replaceChildren(); addCell('sum(1, 2, 3) + sqrt(16)'); } };
}
