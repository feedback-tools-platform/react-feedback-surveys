import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import styles from './NPS10SurveyNumbers.module.scss';

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export interface NPS10SurveyNumbersProps {
  classNames?: ScaleClassNames;
  minLabel?: string;
  maxLabel?: string;
  /** Builds the aria-label for a scale button. @default (score) => `Score ${score}` */
  getScoreLabel?: (score: number) => string;
  /** Builds the text appended after the first/last button when it carries `minLabel`/`maxLabel`. @default (label) => ` - ${label}` */
  getScoreLabelSuffix?: (label: string) => string;
  onChange: (value: number) => void;
}

export const NPS10SurveyNumbers: React.FC<NPS10SurveyNumbersProps> = ({
  classNames,
  minLabel,
  maxLabel,
  getScoreLabel = (score) => `Score ${score}`,
  getScoreLabelSuffix = (label) => ` - ${label}`,
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
            aria-label={getScoreLabel(score)}
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
                {getScoreLabelSuffix(minLabel)}
              </span>
            )}

            {((score === SCORES[SCORES.length - 1]) && !!maxLabel) && (
              <span
                key="right"
                className={styles.label}
              >
                {getScoreLabelSuffix(maxLabel)}
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
