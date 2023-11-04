import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import Text from './Text';

const FormGroup: React.FC<{
  className?: string;
  label: string | React.ReactNode;
  inputName?: string;
  subLabel?: string | React.ReactNode;
  children?: React.ReactNode;
  style?: CSSProperties;
}> = ({
  children,
  className,
  label,
  inputName,
  subLabel,
  style,
}) => (
  <div
    className={classNames('my-4 w-full', className)}
    style={style}
  >
    <label
      className={classNames(
        'text-sm text-zinc-200',
      )}
      htmlFor={inputName}
    >
      {label}
    </label>
    {subLabel && <Text size="xs">{subLabel}</Text>}
    <div className="mt-1">
      {children}
    </div>
  </div>
);

export default FormGroup;
