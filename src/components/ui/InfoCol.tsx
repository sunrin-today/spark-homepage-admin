interface InfoColumnProps {
  label: string;
  value: React.ReactNode;
}

export function InfoColumn({ label, value }: InfoColumnProps) {
  return (
    <div className="flex flex-col px-3 py-1 gap-1.5">
      <span className="text-sm text-gray">{label}</span>
      <span className="text-base text-black">
        {value}
      </span>
    </div>
  );
}
