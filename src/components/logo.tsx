
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/logo.png" 
        alt="Averzo Logo" 
        style={{ height: '30px', width: 'auto' }}
      />
    </div>
  );
}
