import classNames from "classnames";
import { CSSProperties, RefObject } from "react";

interface Props {
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "password" | "email" | "number" | "url";
  textArea?: boolean;
  name?: string;
  style?: CSSProperties;
  required?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  hidden?: boolean;
}

const InputField = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  type = "text",
  textArea,
  name,
  style,
  required,
  inputRef,
  disabled,
  hidden,
}: Props) => {
  const classes = classNames(
    "bg-zinc-950 px-2 py-1 rounded-md",
    "border-zinc-800 border focus:border-zinc-600",
    "placeholder:text-zinc-400 text-zinc-200 text-sm",
    "hover:bg-zinc-900 duration-100",
    "disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed",
    className,
  );

  return textArea ? (
    <textarea
      hidden={hidden}
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
      disabled={disabled}
    />
  ) : (
    <input
      hidden={hidden}
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
      disabled={disabled}
    />
  );
};

export default InputField;
