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

- **Ready-to-use survey widgets** – CSAT (2 or 5 points), CES (7 points), NPS (1–10).
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

### 2) Styles

```tsx
import 'react-feedback-surveys/index.css';
```

## Widget-by-Widget Overview

Below is a quick overview of each widget, when to use it, and example usage. All examples use the existing API and
shared props.

### CSAT2 (2-point Customer Satisfaction)

Use when you need a very quick binary satisfaction signal at high-traffic points.

[<img src="docs/assets/csat2.png" width="392">](docs/assets/csat2.png)

```tsx
import { CSAT2 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT2
  scaleVisualizationType="csat_2_emojis_thumbs"
  mainQuestion="Are you satisfied with the result?"
  feedbackType="text"
  feedbackQuestion="We’d love to hear your thoughts — what can we improve?"
  feedbackButtonText="Send"
  successText="Thank you for your feedback!"
  onSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleVisualizationType`: `csat_2_emojis_mood` | `csat_2_emojis_thumbs`.

### CSAT5 (5-point Customer Satisfaction)

Balanced satisfaction measurement with more nuance than CSAT2; great for post-interaction surveys.

[<img src="docs/assets/csat5.png" width="392">](docs/assets/csat5.png)

```tsx
import { CSAT5 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT5
  scaleVisualizationType="csat_5_emojis"
  mainQuestion="How would you rate your satisfaction with our product?"
  mainLabelLeft="Very unsatisfied"
  mainLabelRight="Very satisfied"
  feedbackType="text"
  feedbackQuestion="We’d love to hear your thoughts — what can we improve?"
  feedbackButtonText="Send"
  successText="Thanks for your feedback!"
  onSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleVisualizationType`: `csat_5_emojis` | `csat_5_numbers` | `csat_5_stars`.

### CES7 (7-point Customer Effort Score)

Measures how easy or difficult an experience was. Best after a task flow (checkout, onboarding, support resolution).

[<img src="docs/assets/ces7.png" width="412">](docs/assets/ces7.png)

```tsx
import { CES7 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CES7
  scaleVisualizationType="ces_7_numbers"
  mainQuestion="How easy was it to complete your task?"
  mainLabelLeft="Very difficult"
  mainLabelRight="Very easy"
  feedbackType="text"
  feedbackQuestion="We’d love to hear your thoughts — what can we improve?"
  feedbackButtonText="Send"
  successText="Thank you for your feedback!"
  onSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleVisualizationType`: `ces_7_numbers`.

### NPS10 (Net Promoter Score)

Standard 1–10 recommendation likelihood question. Ideal for periodic satisfaction tracking and product sentiment.

[<img src="docs/assets/nps10.png" width="552">](docs/assets/nps10.png)

```tsx
import { NPS10 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<NPS10
  scaleVisualizationType="nps_10_numbers"
  mainQuestion="How likely are you to recommend our product/service to a friend or colleague?"
  mainLabelLeft="Very unlikely"
  mainLabelRight="Very likely"
  feedbackType="text"
  feedbackQuestion="We’d love to hear your thoughts — what can we improve?"
  feedbackButtonText="Send"
  successText="Thank you for your feedback!"
  onSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleVisualizationType`: `nps_10_numbers`.

## Props

Most props are shared across all survey widgets. Each widget differs only in its `scaleVisualizationType` values.

### Shared props

| Prop                 | Type                                                                                                                                                                                                    | Required | Description                                                  |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------|
| `animated`           | `boolean`                                                                                                                                                                                               | -        | Enables a show-up animation for the widget.                  |
| `classNames`         | `{ base?: { root?: string; head?: string; title?: string; body?: string; close?: string }; scale?: { root?: string; list?: string; button?: string; icon?: string; score?: string; labels?: string } }` | -        | Optional class names to target internal parts.               |
| `mainQuestion`       | `string`                                                                                                                                                                                                | -        | Main survey question displayed on the first screen.          |
| `mainLabelLeft`      | `string`                                                                                                                                                                                                | -        | Left label for the scale.                                    |
| `mainLabelRight`     | `string`                                                                                                                                                                                                | -        | Right label for the scale.                                   |
| `feedbackType`       | `'none' \| 'text' \| 'choices'`                                                                                                                                                                         | -        | Enables optional follow-up feedback.                         |
| `feedbackQuestion`   | `string`                                                                                                                                                                                                | -        | Follow-up question displayed when `feedbackType !== 'none'`. |
| `feedbackButtonText` | `string`                                                                                                                                                                                                | -        | Submit label for the feedback screen.                        |
| `feedbackChoices`    | `string[] \| null`                                                                                                                                                                                      | -        | Predefined choices (when `feedbackType === 'choices'`).      |
| `successText`        | `string`                                                                                                                                                                                                | -        | Message shown after submission.                              |
| `footerContent`      | `React.ReactNode`                                                                                                                                                                                       | -        | Optional footer content (branding, links, etc.).             |
| `onClose`            | `() => void`                                                                                                                                                                                            | -        | Called when the widget is closed.                            |
| `onSubmit`           | `({ value?: number; comment?: string \| string[] }) => void \| Promise<void>`                                                                                                                           | -        | Called when the score and/or feedback are submitted.         |

### Widget-specific `scaleVisualizationType`

#### CSAT2

| Prop                     | Type                                               | Required | Description                                                                       |
|--------------------------|----------------------------------------------------|----------|-----------------------------------------------------------------------------------|
| `scaleVisualizationType` | `'csat_2_emojis_mood'` \| `'csat_2_emojis_thumbs'` | requred  | Emoji mood visualization (happy/sad faces) or thumbs up/down emoji visualization. |

#### CSAT5

| Prop                     | Type                                                        | Required | Description                                                                                                          |
|--------------------------|-------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------|
| `scaleVisualizationType` | `'csat_5_emojis'` \| `'csat_5_numbers'` \| `'csat_5_stars'` | requred  | Emoji visualization (5 emotion levels), numeric scale visualization (1–5), or star rating visualization (1–5 stars). |

#### CES7

| Prop                     | Type              | Required | Description                        |
|--------------------------|-------------------|----------|------------------------------------|
| `scaleVisualizationType` | `'ces_7_numbers'` | requred  | Numeric scale visualization (1–7). |

#### NPS10

| Prop                     | Type               | Required | Description                         |
|--------------------------|--------------------|----------|-------------------------------------|
| `scaleVisualizationType` | `'nps_10_numbers'` | requred  | Numeric scale visualization (1–10). |

Note: The numeric ranges are defined by the widget (e.g., CSAT5 uses a 1–5 scale, NPS10 uses 1–10).

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

### Styling via classNames (simple and flexible)

All widgets accept a `classNames` prop with two optional groups: `base` (outer shell) and `scale` (the interactive
rating UI). Pass your own class names to override styles without relying on internal selectors.

When is this useful?

- Apply your design system spacing, typography or colors
- Adjust layout (e.g., make the scale full-width, change gaps)
- Restyle scale items (buttons, icons, numbers) consistently

Reference: available keys

| Key            | Applies to                                                   |
|----------------|--------------------------------------------------------------|
| `base.root`    | The outer widget container                                   |
| `base.head`    | Header row containing title and close button                 |
| `base.title`   | The heading that shows main/feedback/success text            |
| `base.body`    | Main content region (rating scale, feedback form or success) |
| `base.close`   | Close button                                                 |
| `scale.root`   | Container around the scale visualization                     |
| `scale.list`   | Wrapper for the interactive items (emojis/stars/numbers)     |
| `scale.button` | Each clickable item in the scale                             |
| `scale.icon`   | Icon inside a scale button (emojis, stars)                   |
| `scale.score`  | Number inside a scale button (for numeric variants)          |
| `scale.labels` | Left/Right labels displayed under the scale                  |

Example: customizing a CSAT5 widget

```tsx
import { CSAT5 } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT5
  scaleVisualizationType="csat_5_numbers"
  mainQuestion="How would you rate your satisfaction with our product?"
  mainLabelLeft="Very unsatisfied"
  mainLabelRight="Very satisfied"
  classNames={{
    base: {
      root: 'my-widget',
      body: 'my-widget-body',
    },
    scale: {
      list: 'my-scale',
      button: 'my-scale-button',
      score: 'my-scale-score',
      labels: 'my-scale-labels',
    }
  }}
  onSubmit={({ value }) => {/* ... */}}
/>
```

You can then style these classes in your app stylesheet.

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

