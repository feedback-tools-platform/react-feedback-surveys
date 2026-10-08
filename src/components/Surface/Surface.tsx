import type { SurveyTheme } from '../../types';
import { cn, getThemeClassName } from '../../utils';

import styles from './Surface.module.scss';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Built-in color theme, inherited by the survey inside. @default 'light' */
  theme?: SurveyTheme;
}

export const Surface: React.FC<SurfaceProps> = ({
  className,
  children,
  theme,
  ...props
}) => (
  <div
    className={cn(styles.base, getThemeClassName(theme), className)}
    part="surface"
    {...props}
  >
    {children}
  </div>
);
