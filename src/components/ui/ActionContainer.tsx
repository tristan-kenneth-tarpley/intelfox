const ActionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="justify-end flex space-x-2">
      {children}
    </div>
  );
};

export default ActionContainer;
