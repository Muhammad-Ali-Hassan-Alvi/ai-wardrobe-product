import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  className?: string;
}

export function OptimizedImage({
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
