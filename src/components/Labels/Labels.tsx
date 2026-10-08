import { cn } from '../../utils';

import styles from './Labels.module.scss';

export interface LabelsProps {
  className?: string;
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
  placement?: 'between' | 'center';
}

export const Labels: React.FC<LabelsProps> = ({
  className,
  minLabel,
  maxLabel,
  placement = 'between',
}) => (
  <div
    className={cn(styles.base, styles[placement], className)}
    part="legend"
  >
    <div className={styles.label}>
      <span className={styles.text}>
        {minLabel}
      </span>
    </div>

    <div className={styles.label}>
      <span className={styles.text}>
        {maxLabel}
      </span>
    </div>
  </div>
);
