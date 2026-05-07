import { Search } from "lucide-react";

type AssetsCatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

function AssetsCatalogSearch({ value, onChange }: AssetsCatalogSearchProps) {
  return (
    <section className="relative w-full">
      <Search
        className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-gray/70"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="بحث في كتالوج الأصول"
        placeholder="ابحث عن أصل بالاسم أو المعرف..."
        className="h-14 w-full rounded-[14px] bg-white py-4 pl-5 pr-14 text-right text-sm sm:text-base text-secondary shadow-[0_10px_30px_rgba(17,24,39,0.06)] placeholder:text-[#99a1af]"
      />
    </section>
  );
}

export default AssetsCatalogSearch;
