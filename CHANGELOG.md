# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **General survey type** - `type="general"` collects text feedback (and an optional screenshot) with no rating scale. See the [README](README.md#general-text-feedback-only).
- **Screenshot attachments** - New `onCaptureScreenshot`, `maxAttachments`, `screenshotButtonLabel`, and `screenshotErrorMessage` props add an optional screenshot-attachment control to the feedback step. `attachmentCaption` overrides the caption shown under the thumbnail. Confirmed attachments are surfaced as `attachments?: Attachment[]` on the `onFeedbackSubmit` payload. See [Attachments](README.md#attachments).
- **`strings` prop** - Overrides the library's built-in aria-labels and other screen-reader-only text (`SurveyStrings`), without touching visible copy. See [Accessibility Labels](README.md#accessibility-labels).
- **`getScoreLabelSuffix` prop** - Customizes the text appended after the first/last numbered scale button when it carries `minLabel`/`maxLabel`.
- **`otherPlaceholder` prop** - Placeholder for the free-text input shown alongside choice checkboxes.
- **`Popup.closeLabel` prop** - Overrides the close button's `aria-label`/`title`.

### Changed

- **`--ft-surface-padding` default is now `20px`** (was `24px`).
- **Screen region `aria-label`s replaced by `aria-labelledby`** - The rating/feedback/contact/success regions now derive their accessible name from each screen's own heading instead of a hardcoded `aria-label`. `Feedback`/`Contact` still expose overridable `feedbackFormLabel`/`contactFormLabel`. Consumer tests querying `getByRole('region', { name: 'Feedback form' })` (etc.) should update.
- **Feedback step: Submit requires content** - Submitting fully empty input is no longer equivalent to Skip. For `responseType: 'text'`, an attachment alone unlocks Submit, but submitting without text flags the field (red border, `aria-invalid`) instead of sending. For `responseType: 'choices'`, an attachment alone doesn't unlock Submit at all — a selected choice or text is required.
- **Feedback step: Skip is disabled while an attachment is confirmed** - Once a screenshot is attached, Skip is disabled until the attachment is removed, so an attachment can no longer be silently discarded.

## [1.8.0] - 2026-08-25

### Changed

- **BREAKING: Single `Survey` component replaces `CSAT5Survey`, `CSAT2Survey`, `CES7Survey`, and `NPS10Survey`** - The four named components are gone. Import `Survey` instead and select the format with props: `type` (`'csat'` | `'nps'` | `'ces'`) and, for `csat`, `points` (`2` | `5`). `scaleStyle` keeps its previous meaning, with valid values now depending on `type`/`points`.
  ```tsx
  // Before
  import { CSAT5Survey } from 'react-feedback-surveys';
  <CSAT5Survey scaleStyle="emoji" question="…" />

  // After
  import { Survey } from 'react-feedback-surveys';
  <Survey type="csat" points={5} scaleStyle="emoji" question="…" />
  ```
  There are no deprecated aliases — update all imports when upgrading. See the [README](README.md#survey-component) for the full format matrix.

### Fixed

- **Input and textarea font inheritance** - Set a system `font-family` on `:root`/`:host` (overridable via `--ft-font-family`), and reset `input`/`textarea`/`select` to inherit it, so form controls no longer fall back to the browser's default (often monospace) font.

## [1.7.0] - 2026-07-17

### Added

- **Optional email collection** - New `collectContact`, `userId`, `contactQuestion`, `contactSubtext`, `contactButtonSendLabel`, and `contactButtonSkipLabel` props add an optional email collection screen before the success screen. Skipped automatically when `userId` is already known. New `onContactSubmit` event fires when a respondent submits an email.
- **Skippable feedback step** - New `textButtonSkipLabel` prop adds a Skip button to the follow-up feedback screen, mirroring the email collection step. Skipping (or submitting with empty input) advances to the next screen without calling `onFeedbackSubmit`.

### Changed

- **BREAKING: `textButtonLabel` renamed to `textButtonSendLabel`** - Aligns naming with the new `textButtonSkipLabel` and the existing `contactButtonSendLabel`/`contactButtonSkipLabel` pair. Update your prop usage:
  ```tsx
  <CSAT5Survey textButtonSendLabel="Send" textButtonSkipLabel="Skip" />
  ```
- **Feedback and label styling** - Added a focus outline to choice checkboxes, fixed font inheritance and checkmark proportions in feedback inputs, and prevented label overflow with `box-sizing: border-box`.

## [1.6.1] - 2026-07-10

### Changed

- **Feedback textarea** - Set explicit text color for correct contrast.
- **Build tooling** - Switched from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react`, and updated `vite`, `vite-plugin-dts`, and `vite-plugin-svgr` to their latest major versions.
- **Accessibility tests** - CI now fails on a11y test violations.

## [1.6.0] - 2026-06-19

### Added

- **CI workflow** - GitHub Actions pipeline with parallel lint, typecheck, and Storybook (Playwright/Chromium) test jobs. Runs on push and pull requests to `main`.
- **README badges** - Added CI status, Storybook badges.

## [1.5.5] - 2026-06-18

### Fixed

- **CSS variable inheritance** - Private CSS variables (`--_*`) are now defined on `:root, :host` instead of inside component classes, fixing inheritance for `Popup` and `Surface` which are ancestors of `SurveyRoot` in the DOM tree.
- **CSS reset scope** - Box model reset (`margin`, `padding`, `box-sizing`) is now applied inside `Popup` as well, covering all descendants including `Surface` and the close button.

## [1.5.4] - 2026-06-18

### Added

- **`--ft-surface-radius` CSS variable** - Configure border radius of survey surface elements without modifying source code.

### Changed

- **CSS variable inheritance** - Refactored variable scoping to work correctly in both shadow DOM and non-shadow DOM environments.
- **Dependencies** - Updated all packages to latest stable versions.

## [1.5.3] - 2026-01-13

### Changed

- **Storybook links** - Updated documentation and resource links in Storybook introduction page and branding configuration.

## [1.5.2] - 2026-01-13

### Added

- **Storybook branding** - Custom logo and branding configuration.
- **Introduction page** - Landing page with project overview, features, quick start guide, and resource links.
- **MDX support** - Enabled MDX file support in Storybook.
- **Multi-platform Docker** - Support for linux/amd64 and linux/arm64 architectures.

## [1.5.1] - 2026-01-13

### Added

- **Docker support** - Storybook now available as a Docker image published to DockerHub. Deploy component documentation as a containerized service with automatic builds on release.
- **GitHub Actions workflow** - Automated Docker image publishing to `feedbacktools/react-feedback-surveys` with version tags.

### Changed

- **Dependencies** - Updated all packages to latest stable versions for security patches and performance improvements.

## [1.5.0] - 2025-12-26

### Added

- **Responsive breakpoint CSS variables** - Customize mobile, tablet, and desktop breakpoints without modifying source code. Makes it easy to integrate with your existing design system.
- **Label center positioning option** - Align labels in the center for balanced, symmetrical layouts. Perfect for emoji-based or icon rating scales.

### Changed

- **Survey screen state classnames** - Refactored internal class names for better predictability. Easier to target specific states when customizing styles or debugging layout issues.
- **Dependencies** - Updated all packages to latest stable versions for security patches and performance improvements.
- **Documentation** - Enhanced README with more practical examples, better formatting, and detailed explanations of:
  - `dir` prop for RTL/LTR support
  - classnames configuration options

## [1.4.1] - 2025-12-24

### Added

- **`--ft-popup-head-offset` CSS variable** - Control popup header padding dynamically. Adjust spacing based on your layout requirements without CSS overrides.

### Fixed

- **Popup title overflow** - Fixed layout bug where long survey titles overlapped the close button. Button now remains clickable in all cases.

## [1.4.0] - 2025-12-23

### Changed

- **BREAKING: `comment` parameter renamed to `text`** - More accurate naming for user feedback input across the API. Update your callback handlers:
  ```javascript
  onFeedbackSubmit={({ text, rating }) => ...}
  ```

## [1.3.0] - 2025-12-22

### Added

- **`<Surface>` component** - New container component for building custom survey layouts. Use as a foundation when creating your own survey designs.
- **Padding variables documentation** - Complete reference for all available CSS padding variables. Helps achieve pixel-perfect spacing adjustments.

### Changed

- **CI/CD workflows** - Modernized GitHub Actions pipelines for more reliable builds and faster deployments.

### Fixed

- **Repository URLs** - Corrected broken repository links in package.json and documentation.
- **npm trusted publishing** - Configured automated publishing workflow for more secure package releases.

## [1.2.0]

### Added

- **RTL/LTR bidirectional support** - Full right-to-left text support for Arabic, Hebrew, and other RTL languages. Entire layout flips automatically when `dir="rtl"` is set, including icons and button positioning.
- **Dark theme** - Automatic dark mode that respects system color scheme preferences. Customize colors with CSS variables to match your brand identity.

### Changed

- **Storybook** - Upgraded to latest version with enhanced documentation, more interactive examples, and improved developer experience.

## [1.1.0]

### Added

- **Sensa credits** - Optional branding attribution for library's origins. Fully customizable or can be removed entirely.
- **Automated npm publishing** - GitHub Actions workflow for consistent, reliable package releases without manual intervention.

### Changed

- **Color palette** - Refined default colors to meet WCAG AA accessibility contrast requirements. Better readability for all users.
- **Storybook viewports** - Added realistic device viewport presets (iPhone, iPad, desktop) for accurate responsive testing.
- **Survey state management** - Improved internal value handling for more predictable behavior across component lifecycle.
- **Dependencies** - Updated all packages to latest versions for security patches and performance improvements.

### Fixed

- **Popup dimensions** - Fixed inconsistent sizing across different screen sizes. Popups now scale gracefully from mobile to desktop.
- **Popup z-index** - Increased default z-index value to ensure popups appear above most common UI elements without manual CSS adjustments.
- **Package metadata** - Corrected broken license link in package.json.

## [1.0.0]

### Added

- **Initial release** - Flexible, customizable React library for collecting user feedback through beautiful surveys. Built with accessibility and developer experience as core priorities.
- **Survey components** - Complete set of ready-to-use components including:
  - Rating scales with multiple visual styles
  - Text feedback forms with validation
  - Multiple layout modes (popup, inline, embedded)
- **Storybook documentation** - Interactive documentation with live component examples, code snippets, and step-by-step customization guides.
