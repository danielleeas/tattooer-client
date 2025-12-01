"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface LoadingSplashProps {
  message?: string;
  className?: string;
  isStartAnimation?: boolean;
  welcomImageUrl?: string;
  artistName?: string;
  instagramHandle?: string;
}

export function LoadingSplash({
  message,
  className = "",
  isStartAnimation = true,
  welcomImageUrl = "/assets/images/logo_text.png",
  artistName = "Artist",
  instagramHandle = "artist",
}: LoadingSplashProps) {
  const [animationPhase, setAnimationPhase] = useState<
    "initial" | "phase1" | "phase2" | "showImage" | "complete"
  >("initial");

  useEffect(() => {
    if (!isStartAnimation) {
      return;
    }

    // Start first animation phase after component mounts
    const timer1 = setTimeout(() => {
      setAnimationPhase("phase1");
    }, 1000);

    // Start second animation phase after first completes
    const timer2 = setTimeout(() => {
      setAnimationPhase("phase2");
    }, 2000); // 100ms delay + 900ms animation

    // Show image for 3 seconds after animation completes
    const timer3 = setTimeout(() => {
      setAnimationPhase("showImage");
    }, 3000); // 100ms delay + 900ms animation + 1s buffer

    // Destroy component after 3 seconds of showing image
    const timer4 = setTimeout(() => {
      setAnimationPhase("complete");
    }, 6000); // 3 seconds for image + 3 seconds total animation time

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isStartAnimation]);

  return (
    <div
      className={`min-h-screen bg-background transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden absolute top-0 left-0 w-full h-full z-50 ${
        animationPhase === "complete" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-2xl flex items-center justify-center transition-all duration-1000 ease-in-out ${
          animationPhase === "showImage" ? "hidden" : ""
        }`}
      >
        <div
          className={`w-full flex items-center transition-all duration-1000 ease-in-out justify-center overflow-hidden ${
            animationPhase === "initial" ? "h-full" : "h-0"
          }`}
        >
          <Image
            src={"/assets/images/logo_text.png"}
            alt={animationPhase === "showImage" ? "Complete" : "Loading"}
            width={140}
            height={140}
          />
        </div>
      </div>
      <div
        className={`border-r-2 border-l-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out ${
          animationPhase === "initial"
            ? "w-24 h-0"
            : animationPhase === "phase1"
            ? "w-24 h-full"
            : "w-[600px] h-full opacity-0 border-r-20 border-l-20"
        }`}
      ></div>

      {/* Third image with new animation */}
      <div
        className={`transition-all w-[390px] min-h-screen flex justify-center items-center gap-4 duration-1000 ease-in-out flex-col ${
          animationPhase === "showImage" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div>
          <h1 className="text-4xl text-foreground text-center">{artistName}</h1>
          {instagramHandle && (
            <p className="text-xl text-foreground text-center">
              {instagramHandle}
            </p>
          )}
        </div>
        <Image
          src={welcomImageUrl}
          alt="Third Image"
          className="w-full"
          width={390}
          height={390}
        />
        <div className="flex flex-col justify-end items-end w-full">
          <h2 className="text-3xl text-foreground text-right">
            Simple Tattooer.
          </h2>
          <p className="text-xs text-foreground text-right">
            Helping tattoo artists just tattoo again.
          </p>
        </div>
      </div>
    </div>
  );
}
