import { natural } from './zero_natural.js';

/** Модуль 1 — единственные пока операции: сложение и вычитание натуральных. */
export const add = (left, right) => natural(natural(left) + natural(right));

/**
 * Отрицательных натуральных чисел в модуле 0 нет. Поэтому `3 - 5` — ошибка,
 * а не скрытое превращение в отрицательное число или «обрезание» до нуля.
 */
export function subtract(left, right) {
  natural(left); natural(right);
  if (right > left) throw new Error('Вычитание вышло за множество натуральных чисел.');
  return left - right;
}
