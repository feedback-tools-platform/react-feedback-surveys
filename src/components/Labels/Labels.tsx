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
}

export const Labels: React.FC<LabelsProps> = ({
  className,
  classNames,
  minLabel,
  maxLabel
}) => (
  <div className={cn(styles.base, classNames?.base, className)}>
    <div className={cn(styles.label, classNames?.label)}>
      {minLabel}
    </div>

    <div className={cn(styles.label, classNames?.label)}>
      {maxLabel}
    </div>
  </div>
);
