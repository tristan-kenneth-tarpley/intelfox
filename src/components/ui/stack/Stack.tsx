import classNames from 'classnames';
import { StackProps } from './types';

const Stack = ({
  children,
  className,
  space = 4,
  align = 'center',
  justify = 'start',
  direction = 'column',
}: StackProps) => {
  return (
    <div className={classNames('flex', className, {
      'flex-col': direction === 'column',
      'space-x-1': space === 1 && direction === 'row',
      'space-x-2': space === 2 && direction === 'row',
      'space-x-4': space === 4 && direction === 'row',
      'space-x-8': space === 8 && direction === 'row',
      'space-x-12': space === 12 && direction === 'row',
      'space-x-16': space === 16 && direction === 'row',
      'space-y-1': space === 1 && direction === 'column',
      'space-y-2': space === 2 && direction === 'column',
      'space-y-4': space === 4 && direction === 'column',
      'space-y-8': space === 8 && direction === 'column',
      'space-y-12': space === 12 && direction === 'column',
      'space-y-16': space === 16 && direction === 'column',
      'items-start': align === 'start',
      'items-center': align === 'center',
      'items-end': align === 'end',
      'justify-start': justify === 'start',
      'justify-between': justify === 'between',
      'justify-center': justify === 'center',
      'justify-end': justify === 'end',
      'justify-around': justify === 'around',
      'justify-evenly': justify === 'evenly',
      'justify-stretch': justify === 'stretch',
    })}>
      {children}
    </div>
  );
};

export default Stack;
