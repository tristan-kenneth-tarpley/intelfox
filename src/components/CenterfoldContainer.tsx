const CenterfoldContainer = ({ children }: {
  children: React.ReactNode
}) => (
  <div className="container mx-auto flex justify-center items-center w-full pt-[10vh]">
    {children}
  </div>
);

export default CenterfoldContainer;
