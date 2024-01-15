import classNames from "classnames";

const Spinner = ({ variant = 'light' }: { variant?: 'light' | 'dark' | 'orange' }) => {
  return (
    <div
      style={{ borderTopColor: 'transparent' }}
      className={classNames(
        'w-4 h-4 border-2 border-solid rounded-full animate-spin border-zinc-200',
        {
          'border-zinc-200': variant === 'light',
          'border-zinc-700': variant === 'dark',
          'border-orange-600': variant === 'orange',
        },
      )}
    />
  );
};

export default Spinner;
