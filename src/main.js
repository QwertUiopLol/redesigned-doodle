import { createNotebook } from './ui/notebook.js';

// Точка сборки интерфейса. Модули математики подключаются из evaluator/checker.
const notebook = createNotebook({ root: document.querySelector('#notebook'), template: document.querySelector('#cell-template') });
notebook.addCell('12 + 7 = 19');
document.querySelector('#add-cell').addEventListener('click', () => notebook.addCell());
document.querySelector('#clear-notebook').addEventListener('click', () => notebook.clear());
