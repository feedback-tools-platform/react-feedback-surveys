import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import styles from './CSAT5SurveyNumbers.module.scss';

const LIST = [1, 2, 3, 4, 5];

export interface CSAT5SurveyNumbersProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

export const CSAT5SurveyNumbers: React.FC<CSAT5SurveyNumbersProps> = ({
  classNames,
  labelLeft,
  labelRight,
  onChange,
}) => {
  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.base, classNames?.base)}>
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
          </button>
        ))}
      </div>

      {!!labelLeft && !!labelRight && (
        <Labels
          className={classNames?.labels}
          labelLeft={labelLeft}
          labelRight={labelRight}
        />
      )}
    </div>
  );
};
