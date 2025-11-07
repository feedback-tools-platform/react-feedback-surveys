import { cn } from '../../utils';

import styles from './Popup.module.scss';

export interface PopupProps {
  animated?: boolean;
  className?: string;
  classNames?: {
    base?: string;
    content?: string;
    close?: string;
  }
  children?: React.ReactNode;
  placement?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
  onClose?: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  animated = true,
  className,
  classNames,
  children,
  placement = 'bottomRight',
  onClose
}) => {
  return (
    <div className={cn(styles.base, { [styles.animated]: animated }, styles[placement], className, classNames?.base)}>
      <div className={cn(styles.content, classNames?.content)}>
        {children}

        <button
          aria-label="Close survey"
          className={cn(styles.close, classNames?.close)}
          title="Close survey"
          type="button"
          onClick={onClose}
        />
      </div>
    </div>
  );
};
