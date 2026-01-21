export const InputWrapper = ({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      <label
        className="text-gray text-sm font-medium"
        htmlFor={htmlFor ? htmlFor : undefined}
      >
        {label}
      </label>
      {children}
    </div>
  );
};
