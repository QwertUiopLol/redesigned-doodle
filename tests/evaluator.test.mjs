import assert from 'node:assert/strict';
import { evaluate } from '../src/core/evaluator.js';
import { createDefaultRegistry } from '../src/core/registry.js';

const functions = createDefaultRegistry();
assert.equal(evaluate('2 * (3 + 4)', functions), 14);
assert.equal(evaluate('2 ^ 3 ^ 2', functions), 512);
assert.equal(evaluate('sum(1, 2, 3) + sqrt(16)', functions), 10);
assert.equal(evaluate('sin(pi / 2)', functions), 1);
// Точка в имени свойства запрещена токенизатором, поэтому выражение не может обратиться к window.
assert.throws(() => evaluate('window.alert(1)', functions), /Недопустимый символ/);
assert.throws(() => evaluate('2 + @', functions), /Недопустимый символ/);
console.log('Evaluator tests passed.');
