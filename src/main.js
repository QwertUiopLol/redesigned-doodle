import { createDefaultRegistry } from './core/registry.js';
import { createNotebook } from './ui/notebook.js';
import { connectLatex } from './ui/latex.js';
import { connectLean } from './ui/lean.js';

// Единственная точка сборки: подключайте новые UI-модули именно здесь.
const notebook = createNotebook({ root: document.querySelector('#notebook'), template: document.querySelector('#cell-template'), registry: createDefaultRegistry() });
notebook.addCell('sin(pi / 2)^2 + cos(pi / 2)^2');
document.querySelector('#add-cell').addEventListener('click', () => notebook.addCell());
document.querySelector('#clear-notebook').addEventListener('click', () => notebook.clear());
connectLatex({ input: document.querySelector('#latex-input'), preview: document.querySelector('#latex-preview'), status: document.querySelector('#latex-status') });
connectLean({ input: document.querySelector('#lean-input'), downloadButton: document.querySelector('#download-lean') });
