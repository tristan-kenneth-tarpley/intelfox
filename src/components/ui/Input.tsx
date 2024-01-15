import classNames from 'classnames';
import { CSSProperties, RefObject } from 'react';

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url';
  textArea?: boolean;
  name?: string;
  style?: CSSProperties;
  required?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

const InputField = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  type = 'text',
  textArea,
  name,
  style,
  required,
  inputRef,
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
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className={classes}
        name={name}
        style={style}
        required={required}
        aria-required={required}
        ref={inputRef as RefObject<HTMLTextAreaElement>}
      />
    ) : (
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={classes}
        name={name}
        style={style}
        required={required}
        aria-required={required}
        ref={inputRef as RefObject<HTMLInputElement>}
      />
    )
  );
};

export default InputField;
