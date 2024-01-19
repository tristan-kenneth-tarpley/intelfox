import classNames from "classnames";

const Label = ({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <label
      className={classNames("text-sm text-zinc-200", className)}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
