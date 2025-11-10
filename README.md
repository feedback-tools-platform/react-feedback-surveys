# react-feedback-surveys

[![npm version](https://img.shields.io/npm/v/react-feedback-surveys.svg?style=flat-square)](https://www.npmjs.com/package/react-feedback-surveys)
[![npm downloads](https://img.shields.io/npm/dm/react-feedback-surveys.svg?style=flat-square)](https://www.npmjs.com/package/react-feedback-surveys)
[![license](https://img.shields.io/npm/l/react-feedback-surveys.svg?style=flat-square)](https://github.com/your-org/feedback-tools/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-feedback-surveys?style=flat-square)](https://bundlephobia.com/package/react-feedback-surveys)

> Lightweight, customizable **CSAT, CES, and NPS survey widgets** for React.

---

## Table of Contents

- [Features](#features)
- [Survey types](#survey-types)
- [Installation](#installation)
    * [1. Install](#1-install)
    * [2. Styles](#2-styles)
- [Survey Components](#survey-components)
    * [CSAT5Survey](#csat5-5-point-customer-satisfaction)
    * [CSAT2Survey](#csat2-2-point-customer-satisfaction)
    * [NPS10Survey](#nps10-net-promoter-score)
    * [CES7Survey](#ces7-7-point-customer-effort-score)
- [Layout Components](#layout-components)
    * [Popup](#popup)
- [Props](#props-1)
    * [Shared props](#shared-props)
    * [Widget-specific](#widget-specific-scalestyle)
        + [CSAT2Survey](#csat2survey)
        + [CSAT5Survey](#csat5survey)
        + [CES7Survey](#ces7survey)
        + [NPS10Survey](#nps10survey)
- [Styling](#styling)
    * [CSS Variables](#css-variables)
    * [Custom Classes](#custom-classes)
- [Demo](#demo)
- [Contributing](#contributing)
    * [Local development (Storybook)](#local-development-storybook)
    * [Library build (watch mode)](#library-build-watch-mode)
    * [Production build](#production-build)
- [Roadmap](#roadmap)
- [License](#license)

---

A minimal, flexible library for embedding customer feedback widgets (CSAT, CES, NPS) into your React apps.  
Supports **emoji, stars, numbers, and thumbs** visualizations.

## Features

- **Ready-to-use survey widgets** – CSAT (2 or 5 points), CES (7 points), NPS (0–10).
- **Multiple visualizations** – emoji, stars, numbers, thumbs.
- **Zero dependencies** – small and tree-shakeable.

## Survey types

- **CSAT (Customer Satisfaction):** `csat2`, `csat5` – 2-point or 5-point scales.
- **NPS (Net Promoter Score):** `nps10` – 0–10 numeric scale.
- **CES (Customer Effort Score):** `ces7` – 7-point numeric scale.

## Installation

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

## Survey Components

Below is a quick overview of each widget, when to use it, and example usage. All examples use the existing API and
shared props.

### CSAT5 (5-point Customer Satisfaction)

Balanced satisfaction measurement with more nuance than CSAT2; great for post-interaction surveys.

[<img src="docs/assets/csat5.png" width="392">](docs/assets/csat5.png)

```tsx
import { CSAT5Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT5Survey
  scaleStyle="emoji"
  question="How would you rate your satisfaction with our product?"
  minLabel="Very unsatisfied"
  maxLabel="Very satisfied"
  responseType="text"
  textQuestion="We'd love to hear your thoughts — what can we improve?"
  textButtonLabel="Send"
  thankYouMessage="Thanks for your feedback!"
  onScoreSubmit={({ value }) => {/* ... */}}
  onFeedbackSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleStyle`: `emoji` | `numbers` | `stars`.

### CSAT2 (2-point Customer Satisfaction)

Use when you need a very quick binary satisfaction signal at high-traffic points.

[<img src="docs/assets/csat2.png" width="392">](docs/assets/csat2.png)

```tsx
import { CSAT2Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT2Survey
  scaleStyle="thumbs"
  question="Are you satisfied with the result?"
  responseType="text"
  textQuestion="We'd love to hear your thoughts — what can we improve?"
  textButtonLabel="Send"
  thankYouMessage="Thank you for your feedback!"
  onScoreSubmit={({ value }) => {/* ... */}}
  onFeedbackSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleStyle`: `emoji` | `thumbs`.

### NPS10 (Net Promoter Score)

Standard 0–10 recommendation likelihood question. Ideal for periodic satisfaction tracking and product sentiment.

[<img src="docs/assets/nps10.png" width="552">](docs/assets/nps10.png)

```tsx
import { NPS10Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<NPS10Survey
  scaleStyle="numbers"
  question="How likely are you to recommend our product/service to a friend or colleague?"
  minLabel="Very unlikely"
  maxLabel="Very likely"
  responseType="text"
  textQuestion="We'd love to hear your thoughts — what can we improve?"
  textButtonLabel="Send"
  thankYouMessage="Thank you for your feedback!"
  onScoreSubmit={({ value }) => {/* ... */}}
  onFeedbackSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleStyle`: `numbers`.

### CES7 (7-point Customer Effort Score)

Measures how easy or difficult an experience was. Best after a task flow (checkout, onboarding, support resolution).

[<img src="docs/assets/ces7.png" width="412">](docs/assets/ces7.png)

```tsx
import { CES7Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CES7Survey
  scaleStyle="numbers"
  question="How easy was it to complete your task?"
  minLabel="Very difficult"
  maxLabel="Very easy"
  responseType="text"
  textQuestion="We'd love to hear your thoughts — what can we improve?"
  textButtonLabel="Send"
  thankYouMessage="Thank you for your feedback!"
  onScoreSubmit={({ value }) => {/* ... */}}
  onFeedbackSubmit={({ value, comment }) => {/* ... */}}
/>
```

`scaleStyle`: `numbers`.

## Layout Components

### Popup

The `<Popup>` component is a wrapper for displaying survey widgets in a fixed-position modal container anchored to one
of the screen edges. It provides a modal-like overlay with positioning, animations, and a close button.

#### Usage

```tsx
import { Popup, CSAT5Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<Popup
  animated
  classNames={{
    base: 'custom-popup-base',
    content: 'custom-popup-content',
    close: 'custom-popup-close'
  }}
  placement="bottomRight"
  onClose={() => console.log('Closed')}
>
  <CSAT5Survey
    scaleStyle="emoji"
    question="How would you rate your satisfaction?"
    onScoreSubmit={({ value }) => {/* ... */}}
  />
</Popup>
```

#### Props

| Prop         | Type                                                       | Required | Default         | Description                                                        |
|--------------|------------------------------------------------------------|----------|-----------------|--------------------------------------------------------------------|
| `placement`  | `'topLeft' \| 'topRight' \| 'bottomRight' \| 'bottomLeft'` | -        | `'bottomRight'` | Position of the popup relative to the screen edges.                |
| `animated`   | `boolean`                                                  | -        | `true`          | Enables a fade-in animation when the popup appears.                |
| `className`  | `string`                                                   | -        | -               | Additional CSS class name for the popup container.                 |
| `classNames` | `{ base?: string; content?: string; close?: string }`      | -        | -               | Optional class names for internal popup elements.                  |
| `children`   | `React.ReactNode`                                          | -        | -               | Content to render inside the popup (typically a survey component). |
| `onClose`    | `() => void`                                               | -        | -               | Callback fired when the close button is clicked.                   |

For more examples, see the Storybook stories (e.g., `CSAT5Survey.stories.tsx`, `CSAT2Survey.stories.tsx`).

## Props

Most props are shared across all survey widgets. Each widget differs only in its `scaleStyle` values.

### Shared props

| Prop               | Type                                                                                                                                                                                                    | Required | Description                                                                  |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|------------------------------------------------------------------------------|
| `classNames`       | `{ base?: { base?: string; head?: string; title?: string; body?: string; close?: string }; scale?: { base?: string; list?: string; button?: string; icon?: string; score?: string; labels?: string } }` | -        | Optional class names to target internal parts.                               |
| `question`         | `string`                                                                                                                                                                                                | required | Main survey question displayed on the first screen.                          |
| `minLabel`         | `string`                                                                                                                                                                                                | -        | Left label for the scale.                                                    |
| `maxLabel`         | `string`                                                                                                                                                                                                | -        | Right label for the scale.                                                   |
| `responseType`     | `'none' \| 'text' \| 'choices'`                                                                                                                                                                         | -        | Enables optional follow-up feedback.                                         |
| `textQuestion`     | `string`                                                                                                                                                                                                | -        | Follow-up question displayed when `responseType` is defined.                 |
| `textButtonLabel`  | `string`                                                                                                                                                                                                | -        | Submit label for the feedback screen.                                        |
| `choiceOptions`    | `string[] \| null`                                                                                                                                                                                      | -        | Predefined choices (when `responseType === 'choices'`).                      |
| `thankYouMessage`  | `string`                                                                                                                                                                                                | required | Message shown after submission.                                              |
| `footer`           | `React.ReactNode`                                                                                                                                                                                       | -        | Optional footer content (branding, links, etc.).                             |
| `onClose`          | `() => void`                                                                                                                                                                                            | -        | Called when the widget is closed.                                            |
| `onScoreSubmit`    | `({ value: number }) => void \| Promise<void>`                                                                                                                                                          | -        | Called when a score is selected (before feedback screen if enabled).         |
| `onFeedbackSubmit` | `({ value?: number; comment?: string \| string[] }) => void \| Promise<void>`                                                                                                                           | -        | Called when feedback is submitted (includes the selected score and comment). |

### Widget-specific `scaleStyle`

#### CSAT2Survey

| Prop                     | Type                    | Required | Description                                                                       |
|--------------------------|-------------------------|----------|-----------------------------------------------------------------------------------|
| `scaleStyle` | `'emoji'` \| `'thumbs'` | required | Emoji mood visualization (happy/sad faces) or thumbs up/down emoji visualization. |

#### CSAT5Survey

| Prop                     | Type                                  | Required | Description                                                                                                          |
|--------------------------|---------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------|
| `scaleStyle` | `'emoji'` \| `'numbers'` \| `'stars'` | required | Emoji visualization (5 emotion levels), numeric scale visualization (1–5), or star rating visualization (1–5 stars). |

#### CES7Survey

| Prop                     | Type        | Required | Description                        |
|--------------------------|-------------|----------|------------------------------------|
| `scaleStyle` | `'numbers'` | required | Numeric scale visualization (1–7). |

#### NPS10Survey

| Prop                     | Type        | Required | Description                         |
|--------------------------|-------------|----------|-------------------------------------|
| `scaleStyle` | `'numbers'` | required | Numeric scale visualization (0–10). |

Note: The numeric ranges are defined by the widget (e.g., CSAT5 uses a 1–5 scale, NPS10 uses 0–10).

## Styling

The package ships with minimal default styles. To use them:

```tsx
import 'react-feedback-surveys/index.css';
```

### CSS Variables

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

### Custom Classes

All widgets accept a `classNames` prop with two optional groups: `base` (outer shell) and `scale` (the interactive
rating UI). Pass your own class names to override styles without relying on internal selectors.

When is this useful?

- Apply your design system spacing, typography or colors
- Adjust layout (e.g., make the scale full-width, change gaps)
- Restyle scale items (buttons, icons, numbers) consistently

Reference: available keys

| Key            | Applies to                                                   |
|----------------|--------------------------------------------------------------|
| `base.base`    | The outer widget container                                   |
| `base.head`    | Header row containing title and close button                 |
| `base.title`   | The heading that shows main/feedback/success text            |
| `base.body`    | Main content region (rating scale, feedback form or success) |
| `base.close`   | Close button                                                 |
| `scale.base`   | Container around the scale visualization                     |
| `scale.list`   | Wrapper for the interactive items (emoji/stars/numbers)      |
| `scale.button` | Each clickable item in the scale                             |
| `scale.icon`   | Icon inside a scale button (emoji, stars)                    |
| `scale.score`  | Number inside a scale button (for numeric variants)          |
| `scale.labels` | Left/Right labels displayed under the scale                  |

Example: customizing a CSAT5Survey widget

```tsx
import { CSAT5Survey } from 'react-feedback-surveys';
import 'react-feedback-surveys/index.css';

<CSAT5Survey
  classNames={{
    base: {
      base: 'my-survey-base',
      body: 'my-survey-body',
    },
    scale: {
      list: 'my-scale-list',
      button: 'my-scale-button',
      score: 'my-scale-score',
      labels: 'my-scale-labels',
    }
  }}
  scaleStyle="numbers"
  question="How would you rate your satisfaction with our product?"
  minLabel="Very unsatisfied"
  maxLabel="Very satisfied"
  onScoreSubmit={({ value }) => {/* ... */}}
  onFeedbackSubmit={({ value, comment }) => {/* ... */}}
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

## Roadmap

- [ ] Custom emoji & icon support
- [ ] Dark theme support
- [ ] RTL language support

## License

MIT © feedback.tools

