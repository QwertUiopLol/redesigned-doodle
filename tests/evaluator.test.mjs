import assert from 'node:assert/strict';
import { evaluate } from '../src/core/evaluator.js';
import { check } from '../src/modules/two_checker.js';

assert.equal(evaluate('2 + (3 + 4)'), 9);
assert.equal(evaluate('(12 + 7) - 4'), 15);
assert.throws(() => evaluate('3 - 5'), /вышло за множество натуральных/);
assert.throws(() => evaluate('2 * 3'), /Недопустимый символ/);
assert.throws(() => evaluate('2 + @'), /Недопустимый символ/);
assert.deepEqual(check('12 + 7 = 19'), { left: 19, right: 19, valid: true });
assert.deepEqual(check('12 + 7 = 20'), { left: 19, right: 20, valid: false });
console.log('Evaluator tests passed.');
