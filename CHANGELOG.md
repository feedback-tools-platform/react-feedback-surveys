# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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