import classNames from "classnames";

const Text = ({
  children,
  className,
  size = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "base" | "sm" | "xs";
}) => (
  <p
    className={classNames(
      "text-zinc-300",
      {
        "text-base": size === "base",
        "text-sm": size === "sm",
        "text-xs": size === "xs",
      },
      className,
    )}
  >
    {children}
  </p>
);

export default Text;
