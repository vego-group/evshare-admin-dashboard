"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ContentImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
};

export default function ContentImage({
  src,
  alt,
  sizes,
  className,
}: ContentImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = Boolean(src && failedSrc === src);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={src ? `تعذر تحميل ${alt}` : `${alt} غير متاحة`}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 bg-neutral-100 text-gray",
          className,
        )}
      >
        <ImageOff className="size-6" aria-hidden="true" />
        <span className="text-xs">الصورة غير متاحة</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
