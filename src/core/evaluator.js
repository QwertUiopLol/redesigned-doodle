/**
 * Маленький рекурсивный парсер. Он не исполняет пользовательскую строку как JS,
 * поэтому выражение не получает доступ к window, DOM или произвольным функциям.
 */
const tokenPattern = /\s*(?:(\d+(?:\.\d*)?|\.\d+)|([a-zA-Z_]\w*)|(.))/gy;

function tokenize(source) {
  const tokens = []; let match;
  tokenPattern.lastIndex = 0;
  while ((match = tokenPattern.exec(source))) {
    const [, number, identifier, symbol] = match;
    if (number) tokens.push({ type: 'number', value: Number(number) });
    else if (identifier) tokens.push({ type: 'identifier', value: identifier });
    else if ('+-*/^(),'.includes(symbol)) tokens.push({ type: symbol, value: symbol });
    else throw new Error(`Недопустимый символ «${symbol}».`);
  }
  if (tokens.length === 0) throw new Error('Введите выражение.');
  return tokens;
}

export function evaluate(source, registry) {
  const tokens = tokenize(source); let cursor = 0;
  const peek = () => tokens[cursor];
  const take = (type) => (peek()?.type === type ? tokens[cursor++] : null);
  const require = (type, message) => { if (!take(type)) throw new Error(message); };

  const primary = () => {
    const number = take('number'); if (number) return number.value;
    const name = take('identifier');
    if (name) {
      if (take('(')) {
        const args = []; if (!take(')')) { do { args.push(expression()); } while (take(',')); require(')', 'Ожидалась закрывающая скобка.'); }
        return registry.call(name.value, args);
      }
      if (name.value === 'pi') return Math.PI;
      if (name.value === 'e') return Math.E;
      throw new Error(`Неизвестная константа «${name.value}».`);
    }
    if (take('(')) { const value = expression(); require(')', 'Ожидалась закрывающая скобка.'); return value; }
    throw new Error('Ожидалось число, функция или скобка.');
  };
  const unary = () => take('+') ? unary() : take('-') ? -unary() : primary();
  const power = () => { const base = unary(); return take('^') ? base ** power() : base; };
  const product = () => { let value = power(); while (peek()?.type === '*' || peek()?.type === '/') { const op = tokens[cursor++].type; const rhs = power(); value = op === '*' ? value * rhs : value / rhs; } return value; };
  const expression = () => { let value = product(); while (peek()?.type === '+' || peek()?.type === '-') value = tokens[cursor++].type === '+' ? value + product() : value - product(); return value; };

  const result = expression();
  if (cursor !== tokens.length) throw new Error(`Неожиданное продолжение «${peek().value}».`);
  if (!Number.isFinite(result)) throw new Error('Результат не является конечным числом.');
  return result;
}
