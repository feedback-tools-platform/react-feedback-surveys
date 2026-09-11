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
  /** Close button label, used for both its aria-label and title. @default 'Close survey' */
  closeLabel?: string;
  onClose?: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  animated = true,
  className,
  classNames,
  children,
  placement = 'bottomRight',
  closeLabel = 'Close survey',
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
          aria-label={closeLabel}
          className={cn(styles.close, classNames?.close)}
          title={closeLabel}
          type="button"
          onClick={onClose}
        />
      </Surface>
    </div>
  );
};
