import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import SlightlyFrowningFace from '../../../icons/slightly_frowning_face.svg';
import SmilingFaceIcon from '../../../icons/smiling_face.svg';

import styles from './CSAT2SurveyEmoji.module.scss';

export interface CSAT2SurveyEmojiProps {
  classNames?: ScaleClassNames;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export const CSAT2SurveyEmoji: React.FC<CSAT2SurveyEmojiProps> = ({
  classNames,
  minLabel,
  maxLabel,
  onChange
}) => {
  const LIST: [React.ElementType, number, string][] = [
    [SlightlyFrowningFace, 0, minLabel ?? 'Dissatisfied'],
    [SmilingFaceIcon, 1, maxLabel ?? 'Satisfied']
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
