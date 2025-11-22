import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <Image
        src="/assets/images/logo.png"
        alt="Tattooer logo"
        width={140}
        height={140}
        priority
      />
    </div>
  );
}
