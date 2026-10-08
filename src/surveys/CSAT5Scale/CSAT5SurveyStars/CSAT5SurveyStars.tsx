import { useCallback, useState } from 'react';

import { Labels } from '../../../components/Labels';
import type { SurveyClassNames } from '../../../types';
import { cn } from '../../../utils';

import StarIcon from '../../../icons/star.svg';
import StarFilledIcon from '../../../icons/star_filled.svg';

import styles from './CSAT5SurveyStars.module.scss';

const SCORES = [1, 2, 3, 4, 5];

export interface CSAT5SurveyStarsProps {
  classNames?: SurveyClassNames;
  minLabel?: string;
  maxLabel?: string;
  /** Builds the aria-label for a star button. @default (score) => `${score} ${score > 1 ? 'stars' : 'star'}` */
  getStarsLabel?: (score: number) => string;
  onChange: (value: number) => void;
}

export const CSAT5SurveyStars: React.FC<CSAT5SurveyStarsProps> = ({
  minLabel,
  maxLabel,
  getStarsLabel = (score) => `${score} ${score > 1 ? 'stars' : 'star'}`,
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
    <div
      className={cn(styles.base, classNames?.scale)}
      part="scale"
    >
      <div
        className={cn(styles.list, classNames?.points)}
        part="points"
        onBlur={onBlur}
        onMouseLeave={onBlur}
      >
        {SCORES.map((score) => (
          <button
            key={score}
            aria-label={getStarsLabel(score)}
            className={cn(styles.button, classNames?.point)}
            part="point"
            type="button"
            value={score}
            onClick={onClick}
            onFocus={onHover}
            onMouseOver={onOver}
          >
            {(hovered !== null) && (score <= hovered) ? (
              <StarFilledIcon
                aria-hidden="true"
                className={cn(styles.icon, styles.filled, classNames?.pointIcon, classNames?.pointIconFilled)}
                part="point-icon filled"
                width={40}
                height={40}
              />
            ) : (
              <StarIcon
                aria-hidden="true"
                className={cn(styles.icon, classNames?.pointIcon)}
                part="point-icon"
                width={40}
                height={40}
              />
            )}
          </button>
        ))}
      </div>

      {!!minLabel && !!maxLabel && (
        <Labels
          className={classNames?.legend}
          minLabel={minLabel}
          maxLabel={maxLabel}
        />
      )}
    </div>
  );
};
