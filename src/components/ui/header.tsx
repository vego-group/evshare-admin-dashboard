interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      <h1 className="max-w-full whitespace-normal wrap-break-word text-2xl font-medium leading-8 text-[#101828] sm:text-[30px] sm:leading-9.5">
        {title}
      </h1>

      <p className="max-w-full whitespace-normal wrap-break-word text-sm font-medium leading-6 text-[#6a7282] sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
