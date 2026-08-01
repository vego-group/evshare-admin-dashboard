"use client";

import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./rich-text-editor-impl"), {
  ssr: false,
  loading: () => (
    <div className="h-50 w-full animate-pulse rounded-[14px] bg-primary/4" />
  ),
});

export default RichTextEditor;
