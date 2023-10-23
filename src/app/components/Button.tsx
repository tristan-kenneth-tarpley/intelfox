import classNames from 'classnames';
import Link from 'next/link';
import { noop } from 'lodash';

type ButtonColor = 'primary' | 'secondary' | 'danger';
type Variant = 'fill' | 'ghost' | 'outline';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface IButton {
  id?: string;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  icon?: boolean;
  loading?: boolean;
  iconLeft?: 'plus' | 'file' | React.ReactNode;
  iconRight?: React.ReactNode;
  type?: 'submit' | 'button';
  color?: ButtonColor;
  variant?: Variant;
  href?: string;
  as?: 'button' | 'div';
  size?: ButtonSize;
}

const baseClassNames = (size: ButtonSize) => classNames(
  'text-zinc-200',
  'flex items-center space-x-2',
  'rounded',
  {
    'py-1 px-2 text-sm': size === 'md',
    'py-1 px-2 text-xs': size === 'sm',
    'py-4 px-6 text-md': size === 'lg',
  },
  'border-2 border-solid',
  'duration-100',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
);

const BarebonesButton = (props: any) => <button {...props} />;
const BarebonesDiv = (props: any) => <div {...props} />;

const variantLookup = {
  primary: 'orange',
  secondary: 'cyan',
  danger: 'red',
} as const;

const Button: React.FC<IButton> = ({
  id,
  className,
  color = 'primary',
  variant = 'fill',
  iconLeft,
  iconRight,
  children,
  onClick,
  disabled,
  type,
  href,
  loading,
  as = 'button',
  size = 'md',
}) => {
  const primaryColor = variantLookup[color];

  const variantSpecificClassnames = classNames(
    baseClassNames(size),
    disabled ? {
      'bg-zinc-700 border-zinc-700 text-zinc-200': variant === 'fill',
      'border-transparent': variant === 'ghost',
      'bg-transparent border-zinc-700 text-zinc-700': variant === 'outline' || variant === 'ghost',
    } : {
      [`ring-${primaryColor}-600 bg-${primaryColor}-600 border-${primaryColor}-600 hover:bg-${primaryColor}-400`]: variant === 'fill',
      'bg-transparent': ['ghost', 'outline'].includes(variant),
      [`ring-${primaryColor}-600 border-transparent hover:bg-${primaryColor}-600 bg-opacity-40`]: variant === 'ghost',
      [`ring-${primaryColor}-600 text-${primaryColor}-600 border-${primaryColor}-600 hover:bg-${primaryColor}-200`]: variant === 'outline',
    },
  );

  const BaseComponent = as === 'button' ? BarebonesButton : BarebonesDiv;

  const extraProps = as === 'div' ? { tabIndex: 0, role: 'button' } : {};

  const BodyContent = (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <BaseComponent
      id={id}
      type={type}
      onClick={disabled ? noop : onClick}
      disabled={disabled || loading}
      className={classNames(
        className,
        baseClassNames(size),
        variantSpecificClassnames,
      )}
      {...(href ? { href } : {})}
      {...extraProps}
    >
      {loading && (
        <div
          style={{ borderTopColor: 'transparent' }}
          className={classNames(
            'w-4 h-4 border-2 border-solid rounded-full animate-spin border-zinc-200',
          )}
        />
      )}
      {iconLeft === 'plus' ? (
        <i className="fa-solid fa-plus" />
      ) : iconLeft === 'file' ? (
        <i className="fa-light fa-file-import" />
      ) : (
        iconLeft
      )}
      {children && <span>{children}</span>}
      {iconRight && iconRight}
    </BaseComponent>
  );

  return href ? (
    <Link href={href}>
      {BodyContent}
    </Link>
  ) : (
    BodyContent
  );
};

export default Button;
