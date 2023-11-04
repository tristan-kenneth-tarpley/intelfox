import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import Text from './Text';

const FormGroup: React.FC<{
  className?: string;
  label: string | React.ReactNode;
  inputName?: string;
  subLabel?: string | React.ReactNode;
  labelPosition?: 'left' | 'top';
  children?: React.ReactNode;
  style?: CSSProperties;
}> = ({
  children,
  className,
  label,
  inputName,
  subLabel,
  labelPosition,
  style,
}) => (
  <div
    className={classNames('my-4 w-full', className, {
      'grid grid-cols-4 gap-x-4 items-center': labelPosition === 'left',
    })}
    style={style}
  >
    <label
      className={classNames({
        'col-span-1 text-sm text-zinc-200': labelPosition === 'left',
      })}
      htmlFor={inputName}
    >
      {label}
    </label>
    {subLabel && <Text size="xs">{subLabel}</Text>}
    <div
      className={classNames({
        'col-span-3 w-full': labelPosition === 'left',
      })}
    >
      {children}
    </div>
  </div>
);

export default FormGroup;
