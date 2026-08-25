import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import styles from './CES7SurveyNumbers.module.scss';

const SCORES = [1, 2, 3, 4, 5, 6, 7];

export interface CES7SurveyNumbersProps {
  classNames?: ScaleClassNames;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export const CES7SurveyNumbers: React.FC<CES7SurveyNumbersProps> = ({
  classNames,
  minLabel,
  maxLabel,
  onChange
}) => {
  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.base, classNames?.base)}>
      <div className={cn(styles.list, classNames?.list)}>
        {SCORES.map((score) => (
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

            {((score === SCORES[0]) && !!minLabel) && (
              <span
                key="left"
                className={styles.label}
              >
                {` - ${minLabel}`}
              </span>
            )}

            {((score === SCORES[SCORES.length - 1]) && !!maxLabel) && (
              <span
                key="right"
                className={styles.label}
              >
                {` - ${maxLabel}`}
              </span>
            )}
          </button>
        ))}
      </div>

      {!!minLabel && !!maxLabel && (
        <Labels
          className={cn(styles.labels, classNames?.labels)}
          minLabel={minLabel}
          maxLabel={maxLabel}
        />
      )}
    </div>
  );
};
