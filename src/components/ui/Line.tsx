import classNames from "classnames";

const Line = ({ className }: { className?: string }) => (
  <div className={classNames(className, 'w-full border-t border-solid border-zinc-700')} />
);

export default Line;
