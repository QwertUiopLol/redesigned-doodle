/** Tiny expression parser.  It deliberately supports only a small, readable grammar:
 * number | name | (expr), then + - * / and comparisons = < > <= >=. */
const tokens = (source) => source.match(/\s*(<=|>=|[()+\-*/=<>]|\d+(?:\.\d+)?|[A-Za-z_][\w]*)\s*/g)?.map(x => x.trim()) || [];

export function parse(source) {
  const input = tokens(source); let at = 0;
  const peek = () => input[at]; const take = () => input[at++];
  function primary() { const token = take(); if (!token) throw Error('ожидалось выражение'); if (token === '(') { const value = comparison(); if (take() !== ')') throw Error('нет закрывающей скобки'); return value; } if (/^\d/.test(token)) return { type:'number', value:Number(token) }; if (/^[A-Za-z_]/.test(token)) return { type:'name', value:token }; throw Error(`неожиданный символ «${token}»`); }
  function product() { let node = primary(); while (['*','/'].includes(peek())) node = { type:'binary', op:take(), left:node, right:primary() }; return node; }
  function sum() { let node = product(); while (['+','-'].includes(peek())) node = { type:'binary', op:take(), left:node, right:product() }; return node; }
  function comparison() { let node = sum(); if (['=','<','>','<=','>='].includes(peek())) node = { type:'binary', op:take(), left:node, right:sum() }; return node; }
  const tree = comparison(); if (at < input.length) throw Error(`лишнее: «${peek()}»`); return tree;
}
