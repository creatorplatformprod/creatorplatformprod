import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  text?: string;
};

const BrandWordmark = ({
  className,
  textClassName,
  iconClassName,
  text = "Creator",
}: BrandWordmarkProps) => {
  return (
    <div className={cn("brand-wordmark", className)}>
      <img src="/favicon-67.svg" alt="67 logo" className={cn("brand-logo-icon", iconClassName)} />
      <span className={cn("brand-logo-text", textClassName)}>{text}</span>
    </div>
  );
};

export default BrandWordmark;
