import { parse } from './parser.js';

/**
 * Исполнительский слой тетради.
 *
 * Ядро не знает, что такое натуральное число или группа. Теория сама
 * регистрирует значения и функции через public API ниже. Благодаря этому
 * библиотеку можно заменять без изменения интерфейса редактора.
 */
export class Engine {
  constructor() { this.reset(); }

  reset() {
    this.values = new Map();
    this.functions = new Map();
    this.modules = new Set();
    this.proofs = [];
    this.equal = Object.is;
    this.formatValue = String;
  }

  registerValue(name, value) { this.values.set(name, value); }
  registerFunction(name, implementation) { this.functions.set(name, implementation); }
  registerEquality(implementation) { this.equal = implementation; }
  registerFormatter(implementation) { this.formatValue = implementation; }

  evaluate(ast) {
    if (ast.type === 'number') return ast.value;

    if (ast.type === 'name') {
      if (!this.values.has(ast.value)) throw Error(`имя «${ast.value}» не определено`);
      return this.values.get(ast.value);
    }

    if (ast.type === 'call') {
      const implementation = this.functions.get(ast.name);
      if (!implementation) throw Error(`функция «${ast.name}» не определена`);
      return implementation(...ast.arguments.map((argument) => this.evaluate(argument)));
    }

    const left = this.evaluate(ast.left);
    const right = this.evaluate(ast.right);
    const operations = {
      '+': () => left + right,
      '-': () => left - right,
      '*': () => left * right,
      '/': () => left / right,
      '=': () => this.equal(left, right),
      '<': () => left < right,
      '>': () => left > right,
      '<=': () => left <= right,
      '>=': () => left >= right,
    };
    return operations[ast.op]();
  }

  expression(text) { return this.evaluate(parse(text)); }

  define(name, expression) {
    const value = this.expression(expression);
    this.registerValue(name, value);
    return value;
  }

  prove(name, proposition) {
    const valid = this.expression(proposition) === true;
    if (valid) this.proofs.push({ name, proposition });
    return valid;
  }
}
