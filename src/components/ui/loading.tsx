import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={`animate-spin ${className}`} size={size} />
  );
}

interface LoadingProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingBlock({ className = '', children }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={32} />
      {children && <p className="mt-4 text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingBlock>লোড হচ্ছে...</LoadingBlock>
    </div>
  );
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ loading, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center ${props.className}`}
    >
      {loading && (
        <LoadingSpinner size={16} className="absolute left-3" />
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
}