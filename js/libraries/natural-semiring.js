/**
 * Исполняемая версия теории `theories/natural-semiring.ax`.
 *
 * Значения здесь не являются JavaScript-числами. Каждое натуральное число —
 * это Peano-терм `zero` или `succ(предыдущее)`. Поэтому сложение, вычитание и
 * умножение ниже действительно определены нами по рекурсии, а не переданы
 * встроенному оператору JavaScript.
 */
const zero = Object.freeze({ tag: 'zero' });

function successor(previous) {
  return Object.freeze({ tag: 'succ', previous });
}

function assertNat(value, label = 'аргумент') {
  if (!value || (value.tag !== 'zero' && value.tag !== 'succ')) {
    throw Error(`${label}: ожидалось натуральное число`);
  }
  return value;
}

/** Рекурсивное сложение: 0 + b = b; succ(a) + b = succ(a + b). */
function add(left, right) {
  assertNat(left, 'левый аргумент add');
  assertNat(right, 'правый аргумент add');
  return left.tag === 'zero' ? right : successor(add(left.previous, right));
}

/** Насыщенное вычитание: 0 - b = 0; succ(a) - succ(b) = a - b. */
function subtract(left, right) {
  assertNat(left, 'левый аргумент sub');
  assertNat(right, 'правый аргумент sub');
  if (left.tag === 'zero') return zero;
  if (right.tag === 'zero') return left;
  return subtract(left.previous, right.previous);
}

/** Рекурсивное умножение: 0 * b = 0; succ(a) * b = (a * b) + b. */
function multiply(left, right) {
  assertNat(left, 'левый аргумент mul');
  assertNat(right, 'правый аргумент mul');
  return left.tag === 'zero' ? zero : add(multiply(left.previous, right), right);
}

function equal(left, right) {
  assertNat(left, 'левый аргумент equal');
  assertNat(right, 'правый аргумент equal');
  if (left.tag === 'zero' || right.tag === 'zero') return left.tag === right.tag;
  return equal(left.previous, right.previous);
}

function toDecimal(value) {
  assertNat(value);
  return value.tag === 'zero' ? 0 : 1 + toDecimal(value.previous);
}

function format(value) {
  if (value?.tag === 'zero' || value?.tag === 'succ') return `nat(${toDecimal(value)})`;
  return String(value);
}

export default {
  id: 'natural-semiring',
  label: 'Натуральные числа (Peano)',

  install(engine) {
    // Константы построены из конструкторов этой теории, не из JS number.
    engine.registerValue('nat.zero', zero);
    engine.registerValue('nat.one', successor(zero));
    engine.registerValue('nat.two', successor(successor(zero)));
    engine.registerValue('nat.three', successor(successor(successor(zero))));

    engine.registerFunction('nat.succ', successor);
    engine.registerFunction('nat.add', add);
    engine.registerFunction('nat.sub', subtract);
    engine.registerFunction('nat.mul', multiply);
    engine.registerFunction('nat.equal', equal);
    engine.registerFunction('nat.decimal', toDecimal);

    // Для оператора `=` используем структурное равенство Peano-термов.
    engine.registerEquality((left, right) => {
      if (left?.tag && right?.tag) return equal(left, right);
      return Object.is(left, right);
    });
    engine.registerFormatter(format);
  },
};
