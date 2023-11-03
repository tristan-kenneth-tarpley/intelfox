import classNames from 'classnames';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
}

const InputField = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}: Props) => {
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={classNames(
          'bg-zinc-950 px-2 py-1 rounded-md',
          'border-zinc-800 border focus:border-zinc-600',
          'placeholder:text-zinc-400 text-zinc-200 text-sm',
        )}
      />
    </div>
  );
};

export default InputField;
