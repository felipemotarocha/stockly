import { ReactNode } from "react";
import { cn } from "../_lib/utils";

export const HeaderTitle = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export const HeaderSubtitle = ({ children }: { children: ReactNode }) => {
  return (
    <span className="text-xs font-semibold text-slate-500">{children}</span>
  );
};

export const HeaderLeft = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-1">{children}</div>;
};

export const HeaderRight = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const Header = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      {children}
    </div>
  );
};

export default Header;
