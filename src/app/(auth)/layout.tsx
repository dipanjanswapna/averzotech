import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="absolute top-6">
        <Link href="/" className="mr-6">
            <h1 className="font-headline text-3xl font-bold text-primary">averzo</h1>
        </Link>
      </div>
      {children}
    </div>
  );
}
