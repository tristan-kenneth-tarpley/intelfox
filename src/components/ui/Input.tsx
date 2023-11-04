import classNames from 'classnames';
import { CSSProperties } from 'react';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url';
  textArea?: boolean;
  name?: string;
  style?: CSSProperties
}

const InputField = ({
  value,
  onChange,
  placeholder,
  className,
  type = 'text',
  textArea,
  name,
  style,
}: Props) => {
  const classes = classNames(
    'bg-zinc-950 px-2 py-1 rounded-md',
    'border-zinc-800 border focus:border-zinc-600',
    'placeholder:text-zinc-400 text-zinc-200 text-sm',
    'hover:bg-zinc-900 duration-100',
    className,
  );

  return (
    textArea ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classes}
        name={name}
        style={style}
      />
    ) : (
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={classes}
        name={name}
        style={style}
      />
    )
  );
};

export default InputField;
