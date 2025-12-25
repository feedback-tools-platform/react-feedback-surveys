import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import SlightlyFrowningFace from '../../../icons/slightly_frowning_face.svg';
import SmilingFaceIcon from '../../../icons/smiling_face.svg';

import styles from './CSAT2SurveyEmoji.module.scss';

export interface CSAT2SurveyEmojiProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

export const CSAT2SurveyEmoji: React.FC<CSAT2SurveyEmojiProps> = ({
  classNames,
  labelLeft,
  labelRight,
  onChange
}) => {
  const LIST: [React.ElementType, number, string][] = [
    [SlightlyFrowningFace, 0, labelLeft ?? 'Dissatisfied'],
    [SmilingFaceIcon, 1, labelRight ?? 'Satisfied']
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
