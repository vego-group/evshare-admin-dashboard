import { Search } from "lucide-react";

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex min-h-12 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14 lg:min-h-14">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray sm:right-5 sm:size-[22px]" />
      <input
        type="search"
        aria-label="بحث في الرحلات"
        placeholder="ابحث برقم الرحلة..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary placeholder:text-[#99a1af] sm:text-base"
      />
    </div>
  );
}

export default SearchInput;
