import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import 'highlight.js/styles/github-dark.css';

// javascript highlights JSX tags through the xml grammar
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

export type CodeLanguage = 'css' | 'javascript';

interface HighlightedCodeProps {
  code: string;
  language: CodeLanguage;
}

// token spans only: the block keeps its own background and padding, and its text stays the exact copied code
export const HighlightedCode: React.FC<HighlightedCodeProps> = ({ code, language }) => {
  const html = useMemo(() => hljs.highlight(code, { language }).value, [code, language]);

  return (
    <code dangerouslySetInnerHTML={{ __html: html }} />
  );
};
