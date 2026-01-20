import { cn } from '../../utils';

import styles from './Surface.module.scss';

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement>

export const Surface: React.FC<SurfaceProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(styles.base, className)}
    {...props}
  >
    {children}
  </div>
);
