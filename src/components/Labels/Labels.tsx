import { cn } from '../../utils';

import styles from './Labels.module.scss';

export interface LabelsProps {
  className?: string;
  classNames?: {
    base?: string;
    label?: string;
  }
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
  placement?: 'between' | 'center';
}

export const Labels: React.FC<LabelsProps> = ({
  className,
  classNames,
  minLabel,
  maxLabel,
  placement = 'between',
}) => (
  <div className={cn(styles.base, styles[placement], classNames?.base, className)}>
    <div className={cn(styles.label, classNames?.label)}>
      <span className={styles.text}>
        {minLabel}
      </span>
    </div>

    <div className={cn(styles.label, classNames?.label)}>
      <span className={styles.text}>
        {maxLabel}
      </span>
    </div>
  </div>
);
