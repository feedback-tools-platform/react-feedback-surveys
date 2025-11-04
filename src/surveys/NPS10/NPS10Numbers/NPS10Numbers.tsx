import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import styles from './NPS10Numbers.module.scss';

const LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export interface NPS10NumbersProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

const NPS10Numbers: React.FC<NPS10NumbersProps> = ({
  classNames,
  labelLeft,
  labelRight,
  onChange
}) => {
  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.root, classNames?.root)}>
      <div className={cn(styles.list, classNames?.list)}>
        {LIST.map((score) => (
          <button
            key={score}
            aria-label={`Score ${score}`}
            className={cn(styles.button, classNames?.button)}
            type="button"
            value={score}
            onClick={onScoreChange}
          >
            <span className={cn(styles.score, classNames?.score)}>
              {score}
            </span>

            {((score === LIST[0]) && !!labelLeft) && (
              <span
                key="left"
                className={styles.label}
              >
                {` - ${labelLeft}`}
              </span>
            )}

            {((score === LIST[LIST.length - 1]) && !!labelRight) && (
              <span
                key="right"
                className={styles.label}
              >
                {` - ${labelRight}`}
              </span>
            )}
          </button>
        ))}
      </div>

      {!!labelLeft && !!labelRight && (
        <Labels
          className={cn(styles.labels, classNames?.labels)}
          labelLeft={labelLeft}
          labelRight={labelRight}
        />
      )}
    </div>
  );
};

export default NPS10Numbers;
