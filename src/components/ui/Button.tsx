import classNames from "classnames";
import Link from "next/link";
import { noop } from "lodash";
import Spinner from "./Spinner";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "link"
  | "success";

type ButtonSize = "sm" | "md" | "lg";

export interface IButton {
  id?: string;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  iconLeft?: "plus" | "file" | React.ReactNode;
  iconRight?: React.ReactNode;
  type?: "submit" | "button";
  variant?: Variant;
  href?: string;
  as?: "button" | "div";
  size?: ButtonSize;
  target?: "_blank";
}

const baseClassNames = (size: ButtonSize) =>
  classNames(
    "text-zinc-200",
    "flex items-center space-x-2",
    "rounded",
    {
      "py-1 px-2 text-sm": size === "md",
      "py-1 px-2 text-xs": size === "sm",
      "py-2 px-4 text-md": size === "lg",
    },
    "border border-solid",
    "duration-100",
    "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-orange-600",
    "duration-200",
  );

const BarebonesButton = (props: any) => <button {...props} />;
const BarebonesDiv = (props: any) => <div {...props} />;

const Button: React.FC<IButton> = ({
  id,
  className,
  variant = "primary",
  iconLeft,
  iconRight,
  children,
  onClick,
  disabled,
  type,
  href,
  loading,
  as = "button",
  size = "md",
  target,
}) => {
  const BaseComponent =
    as === "button" && !href ? BarebonesButton : BarebonesDiv;

  const extraProps = as === "div" ? { tabIndex: 0, role: "button" } : {};

  const BodyContent = (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <BaseComponent
      id={id}
      type={type}
      onClick={disabled ? noop : onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={classNames(
        className,
        baseClassNames(size),
        disabled
          ? {
              "bg-transparent border-zinc-700 text-zinc-600": variant,
            }
          : {
              "text-zinc-900 ring-zinc-100 bg-zinc-100 border-zinc-100 hover:bg-zinc-300":
                variant === "primary",
              "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 ring-zinc-100 border-zinc-800":
                variant === "secondary",
              "bg-transparent": ["ghost", "outline"].includes(variant),
              "border-zinc-800 hover:bg-zinc-800 ring-zinc-800":
                variant === "outline",
              "border-transparent hover:bg-zinc-800": variant === "ghost",
              "bg-red-700 border-red-700 hover:bg-red-800 hover:border-red-800 focus:ring-offset-red-800":
                variant === "danger",
              "bg-green-700 border-green-700 hover:bg-green-800 hover:border-green-800 focus:ring-offset-green-800":
                variant === "success",
              "text-zinc-200 border-transparent rounded-none focus:ring-0 focus:ring-offset-0 border-b-zinc-200 hover:text-zinc-400 hover:border-b-zinc-400 px-0":
                variant === "link",
            },
      )}
      {...(href ? { href } : {})}
      {...extraProps}
    >
      {loading && (
        <Spinner variant={variant === "primary" ? "dark" : "light"} />
      )}
      {iconLeft && iconLeft}
      {children && <span>{children}</span>}
      {iconRight && iconRight}
    </BaseComponent>
  );

  return href ? (
    <Link
      className={className}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener" : undefined}
    >
      {BodyContent}
    </Link>
  ) : (
    BodyContent
  );
};

export default Button;
