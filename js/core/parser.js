/**
 * Маленький синтаксический анализатор выражений.
 *
 * Его задача — не быть JavaScript. Он намеренно допускает только выражения,
 * которые может безопасно исполнить наше ядро: числа, имена, вызовы функций,
 * скобки, арифметические операторы и сравнения.
 */
const TOKEN = /\s*(<=|>=|[(),+\-*/=<>]|\d+(?:\.\d+)?|[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*/g;

function tokenize(source) {
  const result = source.match(TOKEN)?.map((token) => token.trim()) ?? [];

  // Проверяем, что регулярное выражение не «проглотило» неизвестный символ.
  if (result.join('') !== source.replace(/\s/g, '')) {
    throw Error('в выражении есть неподдерживаемый символ');
  }

  return result;
}

export function parse(source) {
  const input = tokenize(source);
  let position = 0;
  const peek = () => input[position];
  const take = () => input[position++];

  function parsePrimary() {
    const token = take();
    if (!token) throw Error('ожидалось выражение');

    if (token === '(') {
      const expression = parseComparison();
      if (take() !== ')') throw Error('нет закрывающей скобки');
      return expression;
    }

    if (/^\d/.test(token)) return { type: 'number', value: Number(token) };

    if (/^[A-Za-z_]/.test(token)) {
      if (peek() !== '(') return { type: 'name', value: token };

      take();
      const arguments_ = [];
      if (peek() !== ')') {
        do {
          arguments_.push(parseComparison());
          if (peek() !== ',') break;
          take();
        } while (true);
      }
      if (take() !== ')') throw Error(`нет ')' в вызове ${token}`);
      return { type: 'call', name: token, arguments: arguments_ };
    }

    throw Error(`неожиданный символ «${token}»`);
  }

  function parseProduct() {
    let node = parsePrimary();
    while (['*', '/'].includes(peek())) {
      node = { type: 'binary', op: take(), left: node, right: parsePrimary() };
    }
    return node;
  }

  function parseSum() {
    let node = parseProduct();
    while (['+', '-'].includes(peek())) {
      node = { type: 'binary', op: take(), left: node, right: parseProduct() };
    }
    return node;
  }

  function parseComparison() {
    let node = parseSum();
    if (['=', '<', '>', '<=', '>='].includes(peek())) {
      node = { type: 'binary', op: take(), left: node, right: parseSum() };
    }
    return node;
  }

  const tree = parseComparison();
  if (position < input.length) throw Error(`лишнее: «${peek()}»`);
  return tree;
}
