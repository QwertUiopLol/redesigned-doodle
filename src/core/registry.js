/** Реестр отделяет набор доступных функций от синтаксиса вычислителя. */
export class FunctionRegistry {
  #functions = new Map();

  define(name, implementation, { minArgs = 1, maxArgs = minArgs, description = '' } = {}) {
    if (!/^[a-z][a-z0-9_]*$/i.test(name)) throw new Error(`Некорректное имя функции: ${name}`);
    this.#functions.set(name, { implementation, minArgs, maxArgs, description });
    return this;
  }

  call(name, args) {
    const entry = this.#functions.get(name);
    if (!entry) throw new Error(`Неизвестная функция «${name}».`);
    if (args.length < entry.minArgs || args.length > entry.maxArgs) {
      throw new Error(`${name} ожидает от ${entry.minArgs} до ${entry.maxArgs} аргументов.`);
    }
    return entry.implementation(...args);
  }
}

/** Базовая библиотека специально мала: новые операции добавляются явно. */
export const createDefaultRegistry = () => new FunctionRegistry()
  .define('sin', Math.sin).define('cos', Math.cos).define('tan', Math.tan)
  .define('sqrt', Math.sqrt).define('abs', Math.abs).define('log', Math.log)
  .define('min', Math.min, { minArgs: 1, maxArgs: Infinity })
  .define('max', Math.max, { minArgs: 1, maxArgs: Infinity })
  .define('sum', (...values) => values.reduce((total, value) => total + value, 0), { minArgs: 1, maxArgs: Infinity })
  .define('mean', (...values) => values.reduce((total, value) => total + value, 0) / values.length, { minArgs: 1, maxArgs: Infinity });
