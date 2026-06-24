interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Title */}
      <h1 className="text-[#101828] font-medium leading-9.5 text-[30px] whitespace-nowrap">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-[#6a7282] font-medium leading-6 text-base">
        {subtitle}
      </p>
    </div>
  );
}
