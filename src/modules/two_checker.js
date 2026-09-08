import { evaluate } from '../core/evaluator.js';

/**
 * Модуль 2 — нарочно примитивный прототип проверщика равенств.
 * Он выделен в отдельный файл, чтобы заменить его вашим доказательным ядром,
 * не переписывая notebook или модуль арифметики.
 */
export function check(statement) {
  const parts = statement.split('=');
  if (parts.length !== 2) throw new Error('Проверка ожидает одно равенство: левая часть = правая часть.');
  const [leftText, rightText] = parts;
  const left = evaluate(leftText); const right = evaluate(rightText);
  return { left, right, valid: left === right };
}
