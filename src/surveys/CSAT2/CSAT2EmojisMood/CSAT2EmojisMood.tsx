import { useCallback } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import AngryFaceIcon from '../../../icons/angry_face.svg';
import HeartEyesFaceIcon from '../../../icons/heart_eyes_face.svg';

import styles from './CSAT2EmojisMood.module.scss';

export interface CSAT2EmojisMoodProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

const CSAT2EmojisMood: React.FC<CSAT2EmojisMoodProps> = ({
  classNames,
  labelLeft,
  labelRight,
  onChange
}) => {
  const LIST: [React.ElementType, number, string][] = [
    [AngryFaceIcon, 1, labelLeft ?? 'Dissatisfied'],
    [HeartEyesFaceIcon, 2, labelRight ?? 'Satisfied']
  ];

  const onScoreChange = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.root, classNames?.root)}>
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
              className={cn(styles.icon, classNames?.icon)}
              width={32}
              height={32}
              aria-hidden="true"
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

export default CSAT2EmojisMood;
