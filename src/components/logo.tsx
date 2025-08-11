import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-xl font-bold italic">AVERZO</span>
    </div>
  );
}
