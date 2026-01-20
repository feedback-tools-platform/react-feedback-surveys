import { cn } from '../../utils';

import { Surface } from '../Surface';

import styles from './Popup.module.scss';

export interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  classNames?: {
    base?: string;
    content?: string;
    close?: string;
  }
  placement?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
  onClose?: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  animated = true,
  className,
  classNames,
  children,
  placement = 'bottomRight',
  onClose,
  ...props
}) => {
  return (
    <div
      className={cn(styles.base, { [styles.animated]: animated }, styles[placement], className, classNames?.base)}
      {...props}
    >
      <Surface className={classNames?.content}>
        {children}

        <button
          aria-label="Close survey"
          className={cn(styles.close, classNames?.close)}
          title="Close survey"
          type="button"
          onClick={onClose}
        />
      </Surface>
    </div>
  );
};
