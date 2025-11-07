import { useCallback, useState } from 'react';

import { Labels } from '../../../components/Labels';
import type { ScaleClassNames } from '../../../types';
import { cn } from '../../../utils';

import StarIcon from '../../../icons/star.svg';
import StarFilledIcon from '../../../icons/star_filled.svg';

import styles from './CSAT5SurveyStars.module.scss';

const LIST = [1, 2, 3, 4, 5];

export interface CSAT5SurveyStarsProps {
  classNames?: ScaleClassNames;
  labelLeft?: string;
  labelRight?: string;
  onChange: (value: number) => void;
}

export const CSAT5SurveyStars: React.FC<CSAT5SurveyStarsProps> = ({
  labelLeft,
  labelRight,
  onChange,
  classNames
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const onHover = useCallback((event: React.FocusEvent<HTMLButtonElement>): void => {
    setHovered(Number(event.currentTarget.value));
  }, []);

  const onOver = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    setHovered(Number(event.currentTarget.value));
  }, []);

  const onBlur = useCallback(() => {
    setHovered(null);
  }, []);

  const onClick = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);

  return (
    <div className={cn(styles.base, classNames?.base)}>
      <div
        className={cn(styles.list, classNames?.list)}
        onBlur={onBlur}
        onMouseLeave={onBlur}
      >
        {LIST.map((score) => (
          <button
            key={score}
            aria-label={`${score} ${score > 1 ? 'stars' : 'star'}`}
            className={cn(styles.button, classNames?.button)}
            type="button"
            value={score}
            onClick={onClick}
            onFocus={onHover}
            onMouseOver={onOver}
          >
            {(hovered !== null) && (score <= hovered) ? (
              <StarFilledIcon
                aria-hidden="true"
                className={cn(styles.icon, classNames?.icon)}
                width={40}
                height={40}
              />
            ) : (
              <StarIcon
                aria-hidden="true"
                className={cn(styles.icon, classNames?.icon)}
                width={40}
                height={40}
              />
            )}
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
