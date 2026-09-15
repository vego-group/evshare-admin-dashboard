interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex min-w-0 w-full flex-col gap-2 border-s-[3px] border-primary ps-4">
      <h1 className="max-w-full whitespace-normal wrap-break-word text-2xl font-semibold leading-tight tracking-tight text-secondary sm:text-[30px]">
        {title}
      </h1>

      <p className="max-w-full whitespace-normal wrap-break-word text-sm leading-6 text-text-muted sm:text-base">
        {subtitle}
      </p>
    </header>
  );
}
