import classNames from 'classnames';

const Text = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
  <p className={classNames(
    'text-zinc-300',
    'text-sm',
    className,
  )}>{children}</p>
);

export default Text;
