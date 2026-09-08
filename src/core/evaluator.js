import { add, subtract } from '../modules/one_add_subtract.js';

/**
 * Парсер первого учебного языка: только натуральные числа, +, -, скобки.
 * Здесь нет eval и нет доступа к JavaScript из пользовательской строки.
 */
const tokenPattern = /\s*(?:(\d+)|(.))/gy;

function tokenize(source) {
  const tokens = []; let match;
  // Иначе sticky-регулярное выражение приняло бы хвостовой пробел за символ.
  source = source.trim();
  tokenPattern.lastIndex = 0;
  while ((match = tokenPattern.exec(source))) {
    const [, number, symbol] = match;
    if (number) tokens.push({ type: 'number', value: Number(number) });
    else if ('+-()'.includes(symbol)) tokens.push({ type: symbol, value: symbol });
    else throw new Error(`Недопустимый символ «${symbol}».`);
  }
  if (tokens.length === 0) throw new Error('Введите выражение.');
  return tokens;
}

export function evaluate(source) {
  const tokens = tokenize(source); let cursor = 0;
  const peek = () => tokens[cursor];
  const take = (type) => (peek()?.type === type ? tokens[cursor++] : null);
  const require = (type, message) => { if (!take(type)) throw new Error(message); };

  const primary = () => {
    const number = take('number'); if (number) return number.value;
    if (take('(')) { const value = expression(); require(')', 'Ожидалась закрывающая скобка.'); return value; }
    throw new Error('Ожидалось натуральное число или скобка.');
  };
  const expression = () => { let value = primary(); while (peek()?.type === '+' || peek()?.type === '-') value = tokens[cursor++].type === '+' ? add(value, primary()) : subtract(value, primary()); return value; };

  const result = expression();
  if (cursor !== tokens.length) throw new Error(`Неожиданное продолжение «${peek().value}».`);
  return result;
}
