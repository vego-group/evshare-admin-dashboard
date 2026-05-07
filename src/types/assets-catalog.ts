export type AssetType = "سكوتر" | "دراجة" | "شاحن";

export type AssetStatus = "نشط" | "غير نشط" | "متعطل";

export type AssetsCatalogViewMode = "table" | "card";

export type AssetItem = {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  city: string;
  location: string;
  price: string;
  updatedAt: string;
};
