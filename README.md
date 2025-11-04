# react-feedback-surveys

[![npm version](https://img.shields.io/npm/v/react-feedback-surveys.svg?style=flat-square)](https://www.npmjs.com/package/react-feedback-surveys)
[![npm downloads](https://img.shields.io/npm/dm/react-feedback-surveys.svg?style=flat-square)](https://www.npmjs.com/package/react-feedback-surveys)
[![license](https://img.shields.io/npm/l/react-feedback-surveys.svg?style=flat-square)](https://github.com/your-org/feedback-tools/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-feedback-surveys?style=flat-square)](https://bundlephobia.com/package/react-feedback-surveys)

> Lightweight, customizable **CSAT, CES, and NPS survey widgets** for React.  
 
---

A minimal, flexible library for embedding customer feedback widgets (CSAT, CES, NPS) into your React apps.  
Supports **emojis, stars, numbers, and thumbs** visualizations.

## Features

- **Ready-to-use survey widgets** – CSAT (2 or 5 points), CES (7 points), NPS (0–10).
- **Multiple visualizations** – emojis, stars, numbers, thumbs.
- **Zero dependencies** – small and tree-shakeable.

## Supported survey types

- **CSAT (Customer Satisfaction):** `csat2`, `csat5` – 2-point or 5-point scales.
- **CES (Customer Effort Score):** `ces7` – 7-point numeric scale.
- **NPS (Net Promoter Score):** `nps10` – 1–10 numeric scale.

## Quick Start

### 1) Install

```shell
npm i react-feedback-surveys
# or
yarn add react-feedback-surveys
```

### 2) Import and basic usage

```tsx
import React from 'react';
import { CSAT5 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

export default function App() {
  return (
    <CSAT5
      scaleVisualizationType="csat_5_emojis"
      mainQuestion="How would you rate your satisfaction with our product?"
      mainLabelLeft="Very dissatisfied"
      mainLabelRight="Very satisfied"
      feedbackQuestion="Anything else you'd like to share?"
      feedbackButtonText="Send"
      successText="Thanks for your feedback!"
      onSubmit={({ value, comment }) => {
        // send to your API
      }}
    />
  );
}
```

### 3) Importing other widgets

```tsx
import { CSAT2, CES7, NPS10 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

// CES7
<CES7
  mainQuestion="How easy was it to complete your task?"
  mainLabelLeft="Very hard"
  mainLabelRight="Very easy"
  successText="Thanks!"
  onSubmit={({ value }) => {/* ... */}}
/>;

// NPS10
<NPS10
  mainQuestion="How likely are you to recommend us to a friend?"
  mainLabelLeft="Not likely"
  mainLabelRight="Very likely"
  successText="Thanks!"
  onSubmit={({ value }) => {/* ... */}}
/>;
```

### 4) Styles

```tsx
import 'react-feedback-surveys/index.css';
```

### CSAT5 props (selected)

| Prop                 | Type                                                                                                                                                          | Required | Description                               |
| -------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------| ----------------------------------------- |
| `scaleVisualizationType` | `'csat_5_emojis'` \| `'csat_5_numbers'` \| `'csat_5_stars'` | Yes | Visual style of the 5-point scale. |
| `mainQuestion`       | `string` | - | Main survey question. |
| `mainLabelLeft`      | `string` | - | Left label (e.g., "Not satisfied"). |
| `mainLabelRight`     | `string` | - | Right label (e.g., "Very satisfied"). |
| `feedbackQuestion`   | `string` | - | Follow-up question on screen 2. |
| `feedbackButtonText` | `string` | - | Submit button label for feedback. |
| `successText`        | `string` | - | Text shown after successful submission. |
| `footerContent`      | `React.ReactNode` | - | Optional footer (e.g., "Powered by"). |
| `onClose`            | `() => void` | - | Called when widget is closed. |
| `onSubmit`           | `({ value?: number, comment?: string }) => void | Promise<void>` | - | Called when score or feedback is submitted. |

### Styling

The package ships with minimal default styles. To use them:

```tsx
import 'react-feedback-surveys/index.css';
```

#### Customization (quick)

You can override colors and fonts via CSS variables:

```css
:root {
  --ft-color-text: #272522;
  --ft-color-muted: #667085;
  --ft-control-bg: #F2F4F7;
  --ft-shadow-color: rgba(0, 0, 0, 0.2);
}
```

Or wrap the survey in your own class and target the generated markup.

For deeper customization strategies, see the section below.

### Passing classNames for customization

All widgets accept a `classNames` object with two optional keys: `base` (outer shell) and `scale` (inner visualization). Each key allows targeting specific parts without relying on internal class names.

```tsx
<CSAT5
  scaleVisualizationType="csat_5_numbers"
  mainQuestion="How satisfied are you?"
  classNames={{
    base: { root: 'ft-widget', body: 'ft-body' },
    scale: { list: 'ft-scale', button: 'ft-scale-btn', labels: 'ft-scale-labels' }
  }}
  onSubmit={({ value }) => {/* ... */}}
/>
```

## Minimum React version

- React 18+ is recommended. The library is tested with React 18 and 19 and declares peer dependencies `react: ^18 || ^19` and `react-dom: ^18 || ^19`. React 18 ensures stable hooks behavior and broad ecosystem compatibility. React 19 works as well.

## Demo
- Live Storybook: start locally with `npm run storybook`.

## Contributing

### Local development (Storybook)

```bash
npm i
npm run storybook
```

Storybook runs at http://localhost:6006 and is the recommended way to develop and review components.

### Library build (watch mode)

```bash
npm run dev
```

This builds the package to `dist/` and watches for changes.

### Production build

```bash
npm run build
```

## License
MIT © feedback.tools

