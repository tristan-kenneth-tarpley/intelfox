const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => {
  return (
    <label className="text-sm text-zinc-200" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
