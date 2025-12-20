import { cn } from '../../utils';

import styles from './Surface.module.scss';

export interface SurfaceProps {
  className?: string;
  children?: React.ReactNode;
}

export const Surface: React.FC<SurfaceProps> = ({
  className,
  children
}) => (
  <div className={cn(styles.base, className)}>
    {children}
  </div>
);
