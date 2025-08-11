import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-2xl font-black tracking-wider">AVERZO</span>
    </div>
  );
}
