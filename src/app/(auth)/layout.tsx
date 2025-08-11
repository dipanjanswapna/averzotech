import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="absolute top-6">
        <Link href="/">
            <Logo />
        </Link>
      </div>
      {children}
    </div>
  );
}
