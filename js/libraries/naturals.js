/** Example of a separate mathematical library.  Replace or grow this module freely. */
export default {
  id: 'naturals', label: 'Натуральные числа',
  install(engine) { engine.values.set('zero', 0); engine.values.set('one', 1); engine.values.set('two', 2); }
};
