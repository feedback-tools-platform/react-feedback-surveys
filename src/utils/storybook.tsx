import React from 'react';

export const minHeightDecorator = (minHeight?: number) => (Story: React.FC) => (
  <div style={{ minHeight }}>
    <Story />
  </div>
);
