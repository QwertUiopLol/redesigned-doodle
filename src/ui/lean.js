/** Локальное сохранение не заменяет Lean: это удобный черновик между сессиями. */
const STORAGE_KEY = 'doodle-math-lab:lean-draft';

export function connectLean({ input, downloadButton }) {
  input.value = localStorage.getItem(STORAGE_KEY) || input.value;
  input.addEventListener('input', () => localStorage.setItem(STORAGE_KEY, input.value));
  downloadButton.addEventListener('click', () => {
    const blob = new Blob([input.value], { type: 'text/plain;charset=utf-8' });
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'DoodleTheorem.lean' });
    link.click(); URL.revokeObjectURL(link.href);
  });
}
