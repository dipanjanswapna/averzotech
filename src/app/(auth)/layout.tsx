
import Link from "next/link";
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                 <Logo />
            </div>
            {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative h-screen">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="fashion advertisement"
        />
      </div>
    </div>
  );
}
