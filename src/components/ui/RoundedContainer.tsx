import type { ReactNode } from "react";

type RoundedContainerProps = {
  children: ReactNode;
  className?: string;
};

export function RoundedContainer({
  children,
  className = "",
}: RoundedContainerProps) {
  return (
    <div className={`rounded-t-sheet bg-background lg:rounded-none ${className}`}>
      {children}
    </div>
  );
}
