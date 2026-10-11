import { describe, expect, it } from 'vitest';

import { toUniversalCss } from './toUniversalCss';

describe('toUniversalCss', () => {
  it('adds a plain DOM selector next to a ::part() selector', () => {
    expect(toUniversalCss('.host::part(submit) {\n  color: red;\n}')).toBe(
      '.host::part(submit),\n.host [part~="submit"] {\n  color: red;\n}'
    );
  });

  it('turns every part name into its own attribute selector', () => {
    expect(toUniversalCss('.host::part(choice checked) {}')).toBe(
      '.host::part(choice checked),\n.host [part~="choice"][part~="checked"] {}'
    );
  });

  it('keeps pseudo-classes and pseudo-elements after the part', () => {
    expect(toUniversalCss('.host::part(skip):hover:not(:disabled), .host::part(field)::placeholder {}')).toBe([
      '.host::part(skip):hover:not(:disabled)',
      '.host [part~="skip"]:hover:not(:disabled)',
      '.host::part(field)::placeholder',
      '.host [part~="field"]::placeholder {}'
    ].join(',\n'));
  });

  it('leaves selectors without ::part() and their lists alone', () => {
    const css = '.host {\n  --ft-color-bg: #fff;\n}\n\n.a:is(.b, .c) {}';

    expect(toUniversalCss(css)).toBe(css);
  });

  it('keeps comments, strings and at-rules, and indents selectors inside them', () => {
    const css = [
      '/* title bar; { not a rule } */',
      '.host::part(surface)::before {',
      '  content: \'{ }\';',
      '}',
      '',
      '@media (any-hover: hover) {',
      '  .host::part(point):hover {}',
      '}'
    ].join('\n');

    expect(toUniversalCss(css)).toBe([
      '/* title bar; { not a rule } */',
      '.host::part(surface)::before,',
      '.host [part~="surface"]::before {',
      '  content: \'{ }\';',
      '}',
      '',
      '@media (any-hover: hover) {',
      '  .host::part(point):hover,',
      '  .host [part~="point"]:hover {}',
      '}'
    ].join('\n'));
  });
});
