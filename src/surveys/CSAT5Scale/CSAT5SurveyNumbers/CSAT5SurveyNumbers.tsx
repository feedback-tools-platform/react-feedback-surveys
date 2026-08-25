import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import styles from './CSAT5SurveyNumbers.module.scss';

const SCORES = [1, 2, 3, 4, 5];

export interface CSAT5SurveyNumbersProps {
  classNames?: ScaleClassNames;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export const CSAT5SurveyNumbers: React.FC<CSAT5SurveyNumbersProps> = ({
  classNames,
  minLabel,
  maxLabel,
  onChange,
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
          </button>
        ))}
      </div>

      {!!minLabel && !!maxLabel && (
        <Labels
          className={classNames?.labels}
          minLabel={minLabel}
          maxLabel={maxLabel}
        />
      )}
    </div>
  );
};
