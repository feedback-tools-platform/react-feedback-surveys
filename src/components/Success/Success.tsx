import Popper from '../../icons/popper.svg';

import styles from './Success.module.scss';

export const Success: React.FC = () => (
  <div className={styles.base}>
    <Popper
      aria-hidden="true"
      className={styles.icon}
      width={84}
      height={84}
    />
  </div>
);
