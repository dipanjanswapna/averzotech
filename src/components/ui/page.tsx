import { LoadingBlock, LoadingPage } from '@/components/ui/loading';
import { ErrorMessage, LoadingError } from '@/components/ui/error-message';

interface PageWrapperProps {
  loading: boolean;
  error: string | null;
  fullPage?: boolean;
  retry?: () => void;
  children: React.ReactNode;
}

export function PageWrapper({
  loading,
  error,
  fullPage = false,
  retry,
  children
}: PageWrapperProps) {
  if (loading) {
    return fullPage ? <LoadingPage /> : <LoadingBlock>লোড হচ্ছে...</LoadingBlock>;
  }

  return (
    <LoadingError error={error} retry={retry}>
      {children}
    </LoadingError>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  retry?: () => void;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Section({
  title,
  description,
  loading,
  error,
  retry,
  action,
  className = '',
  children
}: SectionProps) {
  return (
    <section className={`py-8 md:py-12 ${className}`}>
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold md:text-3xl">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>

        {loading ? (
          <LoadingBlock>লোড হচ্ছে...</LoadingBlock>
        ) : error ? (
          <ErrorMessage
            message={error}
            action={retry ? {
              label: 'আবার চেষ্টা করুন',
              onClick: retry
            } : undefined}
          />
        ) : (
          children
        )}
      </div>
    </section>
  );
}