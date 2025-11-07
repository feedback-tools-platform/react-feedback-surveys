import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import { cn } from '../../../utils';
import type { ScaleClassNames } from '../../../types';

import AngryFaceIcon from '../../../icons/angry_face.svg';
import HeartEyesFaceIcon from '../../../icons/heart_eyes_face.svg';
import NeutralFaceIcon from '../../../icons/neutral_face.svg';
import SmilingFaceIcon from '../../../icons/smiling_face.svg';
import WorriedFaceIcon from '../../../icons/worried_face.svg';

import styles from './CSAT5SurveyEmoji.module.scss';

const LIST: [React.ElementType, number][] = [
  [AngryFaceIcon, 1],
  [WorriedFaceIcon, 2],
  [NeutralFaceIcon, 3],
  [SmilingFaceIcon, 4],
  [HeartEyesFaceIcon, 5]
];

export interface CSAT5SurveyEmojiProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

export const CSAT5SurveyEmoji: React.FC<CSAT5SurveyEmojiProps> = ({
  labelLeft,
  labelRight,
  onChange,
  classNames
}) => {
  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.base, classNames?.base)}>
      <div className={cn(styles.list, classNames?.list)}>
        {LIST.map(([Icon, score]) => (
          <button
            key={score}
            aria-label={`Score ${score}`}
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
          className={classNames?.labels}
          labelLeft={labelLeft}
          labelRight={labelRight}
        />
      )}
    </div>
  );
};
