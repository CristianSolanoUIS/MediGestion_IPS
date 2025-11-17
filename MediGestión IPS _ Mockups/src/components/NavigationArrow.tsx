import { ArrowRight } from "lucide-react";

interface NavigationArrowProps {
  label: string;
  className?: string;
}

export function NavigationArrow({ label, className = "" }: NavigationArrowProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 border-t-2 border-dashed border-blue-400"></div>
      <div className="bg-blue-100 border-2 border-dashed border-blue-400 px-3 py-1 rounded-full">
        <span className="text-sm text-blue-800">{label}</span>
      </div>
      <ArrowRight className="h-5 w-5 text-blue-600" />
      <div className="flex-1 border-t-2 border-dashed border-blue-400"></div>
    </div>
  );
}