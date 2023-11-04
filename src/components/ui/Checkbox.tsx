import classNames from 'classnames';

const Checkbox = ({
  describedBy,
  name,
  className,
  checked,
  id,
  onChange,
}: {
  describedBy?: string;
  name: string;
  className?: string;
  checked?: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      id={id}
      checked={checked}
      onChange={onChange}
      aria-describedby={describedBy}
      name={name}
      type="checkbox"
      className={classNames(
        'h-4 w-4 rounded bg-zinc-950 border-2 border-gray-300 text-blue-700 focus:ring-blue-700',
        className,
      )}
    />
  );
};

export default Checkbox;
