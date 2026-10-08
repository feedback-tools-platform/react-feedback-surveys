import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../utils';

// mirrors the SDK: a `.ftools-survey` host with the library styles inside its shadow root
export const ShadowHost: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    if (!host.shadowRoot) {
      const shadow = host.attachShadow({ mode: 'open' });

      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        shadow.appendChild(node.cloneNode(true));
      });
    }

    setRoot(host.shadowRoot);
  }, []);

  return (
    <div
      ref={hostRef}
      className={cn('ftools-survey', className)}
      {...props}
    >
      {!!root && createPortal(children, root)}
    </div>
  );
};
