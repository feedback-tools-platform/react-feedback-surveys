const PART = /::part\(([^)]*)\)/g;

// `::part()` only reaches into a shadow root; part attributes are the same in plain DOM, so match them there
const toPlainDomSelector = (selector: string): string => selector.replace(PART, (_, names: string) => {
  const attributes = names.trim().split(/\s+/).map((name) => `[part~="${name}"]`);

  return ` ${attributes.join('')}`;
});

// commas inside `:not()`, `:is()` and the like don't separate selectors
const splitSelectorList = (list: string): string[] => {
  const selectors: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of list) {
    if (char === '(') {
      depth += 1;
    }

    if (char === ')') {
      depth -= 1;
    }

    if (char === ',' && depth === 0) {
      selectors.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  selectors.push(current.trim());

  return selectors;
};

const transformPrelude = (prelude: string): string => {
  const [, head = '', body = ''] = /^((?:\s|\/\*[\s\S]*?\*\/)*)([\s\S]*)$/.exec(prelude) ?? [];

  if (body.startsWith('@') || !body.includes('::part(')) {
    return prelude;
  }

  const indent = /[^\S\n]*$/.exec(head)?.[0] ?? '';
  const selectors = splitSelectorList(body).flatMap((selector) => (
    selector.includes('::part(') ? [selector, toPlainDomSelector(selector)] : [selector]
  ));

  return `${head}${selectors.join(`,\n${indent}`)} `;
};

/** Adds a plain DOM twin to every `::part()` selector, so one stylesheet styles the widget inside and outside a shadow root */
export const toUniversalCss = (css: string): string => {
  let output = '';
  let prelude = '';
  let index = 0;

  while (index < css.length) {
    const char = css[index];

    if (css.startsWith('/*', index)) {
      const end = css.indexOf('*/', index + 2);
      const next = end === -1 ? css.length : end + 2;

      prelude += css.slice(index, next);
      index = next;
      continue;
    }

    if (char === '"' || char === '\'') {
      const end = css.indexOf(char, index + 1);
      const next = end === -1 ? css.length : end + 1;

      prelude += css.slice(index, next);
      index = next;
      continue;
    }

    if (char === '{') {
      output += `${transformPrelude(prelude)}{`;
      prelude = '';
    } else if (char === '}' || char === ';') {
      output += `${prelude}${char}`;
      prelude = '';
    } else {
      prelude += char;
    }

    index += 1;
  }

  return output + prelude;
};
