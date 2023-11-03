import classNames from 'classnames';
import React from 'react';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = {
  level: Level;
  displayAs?: Level;
  className?: string;
  children: React.ReactNode;
};

const displayClasses = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-semibold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold',
} as const;

const Heading: React.FC<HeadingProps> = ({
  level, displayAs, className, children,
}) => {
  const Tag = `h${level}`;

  return (
    // @ts-expect-error TypeScript doesn't like this
    <Tag className={classNames('text-zinc-200', displayClasses[displayAs ?? level], className)}>
      {children}
    </Tag>
  );
};

export default Heading;
