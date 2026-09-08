/**
 * Модуль 0 — определение натуральных чисел нашего маленького языка.
 * Пока представление простое (безопасное JavaScript-целое), чтобы его легко
 * заменить позднее, например, на собственную Peano-структуру или BigInt.
 */
export function natural(value) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('Ожидалось натуральное число (0, 1, 2, ...).');
  }
  return value;
}
