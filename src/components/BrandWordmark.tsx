import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  iconClassName?: string;
};

const BrandWordmark = ({
  className,
  iconClassName,
}: BrandWordmarkProps) => {
  return (
    <div className={cn("brand-wordmark", className)}>
      <img src="/favicon-67.svg" alt="67 logo" className={cn("brand-logo-icon", iconClassName)} />
    </div>
  );
};

export default BrandWordmark;
