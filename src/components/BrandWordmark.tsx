import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
};

/** Legacy slot — use plain text wordmark matching CreatorLockup. */
const BrandWordmark = ({ className }: BrandWordmarkProps) => {
  return (
    <span className={cn("creator-lockup-wordmark", className)}>
      sixsevencreator
    </span>
  );
};

export default BrandWordmark;
