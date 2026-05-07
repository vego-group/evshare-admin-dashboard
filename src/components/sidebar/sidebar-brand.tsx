import Image from "next/image";

type SidebarBrandProps = {
  compact?: boolean;
};

function SidebarBrand({ compact = false }: SidebarBrandProps) {
  return (
    <Image
      src={compact ? "/images/favicon.svg" : "/images/logo.svg"}
      alt={compact ? "EV Share favicon" : "EV Share"}
      width={compact ? 100 : 150}
      height={compact ? 100 : 42}
      className={compact ? "h-10 w-auto object-contain" : "h-10 w-auto object-contain"}
      priority={!compact}
    />
  );
}

export default SidebarBrand;
