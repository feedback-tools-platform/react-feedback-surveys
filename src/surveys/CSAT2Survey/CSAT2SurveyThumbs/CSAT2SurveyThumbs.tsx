import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import ThumbsDownIcon from '../../../icons/thumbs_down.svg';
import ThumbsUpIcon from '../../../icons/thumbs_up.svg';

import styles from './CSAT2SurveyThumbs.module.scss';

export interface CSAT2SurveyThumbsProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

export const CSAT2SurveyThumbs: React.FC<CSAT2SurveyThumbsProps> = ({
  classNames,
  labelLeft,
  labelRight,
  onChange
}) => {
  const LIST: [React.ElementType, number, string][] = [
    [ThumbsDownIcon, 1, labelLeft ?? 'Thumbs down'],
    [ThumbsUpIcon, 2, labelRight ?? 'Thumbs up']
  ];

  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.base, classNames?.base)}>
      <div className={cn(styles.list, classNames?.list)}>
        {LIST.map(([Icon, score, label]) => (
          <button
            key={score}
            aria-label={label}
            className={cn(styles.button, classNames?.button)}
            type="button"
            value={score}
            onClick={onScoreChange}
          >
            <Icon
              aria-hidden="true"
              className={cn(styles.icon, classNames?.icon)}
              width={32}
              height={32}
            />
          </button>
        ))}
      </div>

      <Labels
        className={cn(styles.labels, classNames?.labels)}
        labelLeft={labelLeft}
        labelRight={labelRight}
      />
    </div>
  );
};
