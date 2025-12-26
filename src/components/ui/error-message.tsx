import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'default' | 'destructive' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  variant = 'destructive',
  action
}: ErrorMessageProps) {
  const Icon = {
    default: AlertCircle,
    destructive: XCircle,
    warning: AlertTriangle
  }[variant];

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message}
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="ml-auto"
          >
            {action.label}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface LoadingErrorProps {
  error: string | null;
  children: React.ReactNode;
  retry?: () => void;
}

export function LoadingError({ error, children, retry }: LoadingErrorProps) {
  if (error) {
    return (
      <div className="container py-8">
        <ErrorMessage 
          message={error}
          action={retry ? {
            label: 'আবার চেষ্টা করুন',
            onClick: retry
          } : undefined}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export function EmptyState({ 
  title, 
  message,
  action
}: {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}