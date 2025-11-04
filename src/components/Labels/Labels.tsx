import styles from './Labels.module.scss';

interface LabelsProps {
  className?: string;
  labelLeft?: React.ReactNode;
  labelRight?: React.ReactNode;
}

const Labels: React.FC<LabelsProps> = ({
  className = '',
  labelLeft,
  labelRight
}) => (
  <div className={`${styles.root} ${className}`}>
    <div className={styles.label}>
      {labelLeft}
    </div>

    <div className={styles.label}>
      {labelRight}
    </div>
  </div>
);

export default Labels;
