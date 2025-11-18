const DropdownComponent = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  return (
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
      <div>{children}</div>
    </div>
  );
};
export default DropdownComponent;
