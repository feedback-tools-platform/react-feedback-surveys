import type { SurveyTheme } from '../../types';
import { cn, getThemeClassName } from '../../utils';

import { Surface } from '../Surface';

import styles from './Popup.module.scss';

export interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  /** Class names for the card inside the popup and its close button; `className` styles the popup itself */
  classNames?: {
    surface?: string;
    close?: string;
  }
  placement?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
  /** Built-in color theme, inherited by the survey inside. @default 'light' */
  theme?: SurveyTheme;
  /** Close button label, used for both its aria-label and title. @default 'Close survey' */
  closeLabel?: string;
  onClose?: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  animated = true,
  className,
  classNames,
  children,
  placement = 'bottomRight',
  theme,
  closeLabel = 'Close survey',
  onClose,
  ...props
}) => {
  return (
    <div
      className={cn(
        styles.base,
        { [styles.animated]: animated },
        styles[placement],
        getThemeClassName(theme),
        className
      )}
      part="popup"
      {...props}
    >
      <Surface className={cn(styles.content, classNames?.surface)}>
        {children}

        <button
          aria-label={closeLabel}
          className={cn(styles.close, classNames?.close)}
          part="close"
          title={closeLabel}
          type="button"
          onClick={onClose}
        />
      </Surface>
    </div>
  );
};
