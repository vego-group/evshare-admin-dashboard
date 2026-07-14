const PAGE_LABELS: Record<string, string> = {
  "about-us": "من نحن",
  "privacy-policy": "سياسة الخصوصية",
  "terms-and-conditions": "الشروط والأحكام",
  "intellectual-property-policy": "سياسة الملكية الفكرية",
  "subscription-exchange-refund-policy":
    "سياسة الاشتراك والاستبدال والاسترجاع",
};

export function getPageLabel(slug: string) {
  return PAGE_LABELS[slug] ?? slug;
}
