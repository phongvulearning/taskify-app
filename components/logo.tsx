import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 items-center transition md:flex gap-x-2">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p
          className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}
        >
          Taskify
        </p>
      </div>
    </Link>
  );
};
