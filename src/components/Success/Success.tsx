import Popper from '../../icons/popper.svg';

import styles from './Success.module.scss';

const Success: React.FC = () => (
  <div className={styles.root}>
    <Popper
      aria-hidden="true"
      className={styles.icon}
      width={84}
      height={84}
    />
  </div>
);

export default Success;
