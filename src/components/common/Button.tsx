import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  return <button className={clsx(styles.button, styles[variant], className)} {...props} />;
};

export default Button;
