import Popper from '../../icons/popper.svg';
import { cn } from '../../utils';

import styles from './Success.module.scss';

export interface SuccessProps {
  /** Additional class name for the icon */
  iconClassName?: string;
}

export const Success: React.FC<SuccessProps> = ({ iconClassName }) => (
  <div className={styles.base}>
    <Popper
      aria-hidden="true"
      className={cn(styles.icon, iconClassName)}
      part="success-icon"
      width={84}
      height={84}
    />
  </div>
);
