import { cn } from '../../utils';

import styles from './Labels.module.scss';

export interface LabelsProps {
  className?: string;
  labelLeft?: React.ReactNode;
  labelRight?: React.ReactNode;
}

export const Labels: React.FC<LabelsProps> = ({
  className,
  labelLeft,
  labelRight
}) => (
  <div className={cn(styles.base, className)}>
    <div className={styles.label}>
      {labelLeft}
    </div>

    <div className={styles.label}>
      {labelRight}
    </div>
  </div>
);
