"use client";

import {
  TooltipProvider,
  Tooltip as ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
} from "./primitives/tooltip";

const Tooltip = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
