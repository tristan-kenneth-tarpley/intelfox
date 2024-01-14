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
  1: 'text-4xl mb-2 font-bold',
  2: 'text-3xl mb-2 font-semibold',
  3: 'text-2xl mb-1.5 font-semibold',
  4: 'text-xl mb-1.5 font-semibold',
  5: 'text-lg mb-1 font-semibold',
  6: 'text-base mb-1 font-semibold',
} as const;

const Heading: React.FC<HeadingProps> = ({
  level, displayAs, className, children,
}) => {
  const Tag = `h${level}`;

  return (
    // @ts-expect-error TypeScript doesn't like this
    <Tag className={classNames(displayClasses[displayAs ?? level], className)}>
      {children}
    </Tag>
  );
};

export default Heading;
