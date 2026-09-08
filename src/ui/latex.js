/** KaTeX загружается внешним скриптом, поэтому UI показывает понятный fallback. */
export function connectLatex({ input, preview, status }) {
  const render = () => {
    if (!window.katex) { preview.textContent = input.value; status.textContent = 'ожидание KaTeX'; return; }
    try { window.katex.render(input.value, preview, { displayMode: true, throwOnError: true }); status.textContent = 'готово'; }
    catch (error) { preview.textContent = error.message; status.textContent = 'ошибка формулы'; }
  };
  input.addEventListener('input', render); window.addEventListener('load', render); render();
}
