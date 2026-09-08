import { parse } from './parser.js';

/** Evaluation core. Library modules receive this small API and may add constants or rules. */
export class Engine {
  constructor() { this.values = new Map(); this.modules = new Set(); this.proofs = []; }
  reset() { this.values.clear(); this.modules.clear(); this.proofs = []; }
  evaluate(ast) {
    if (ast.type === 'number') return ast.value;
    if (ast.type === 'name') { if (!this.values.has(ast.value)) throw Error(`имя «${ast.value}» не определено`); return this.values.get(ast.value); }
    const a = this.evaluate(ast.left), b = this.evaluate(ast.right);
    return ({ '+':()=>a+b, '-':()=>a-b, '*':()=>a*b, '/':()=>a/b, '=':()=>a===b, '<':()=>a<b, '>':()=>a>b, '<=':()=>a<=b, '>=':()=>a>=b })[ast.op]();
  }
  expression(text) { return this.evaluate(parse(text)); }
  define(name, expression) { const value = this.expression(expression); this.values.set(name, value); return value; }
  prove(name, proposition) { const valid = this.expression(proposition) === true; if (valid) this.proofs.push({ name, proposition }); return valid; }
}
