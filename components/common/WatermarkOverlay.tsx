"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface WatermarkSettings {
  enabled: boolean;
  image?: string | null;
  opacity?: number | null;
  position?: string | null;
  text?: string | null;
}

interface WatermarkOverlayProps {
  watermark: WatermarkSettings | null;
}

export function WatermarkOverlay({ watermark }: WatermarkOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setDimensions({ width: clientWidth, height: clientHeight });
  }, [watermark?.text, watermark?.enabled]);

  if (!watermark?.enabled) return null;

  const getWaterMarkPosition = () => {
    if (watermark.position === "top-left") {
      return "top-0 left-0";
    }
    if (watermark.position === "top-right") {
      return "top-0 right-0";
    }
    if (watermark.position === "bottom-left") {
      return "bottom-0 left-0";
    }
    if (watermark.position === "bottom-right") {
      return "bottom-0 right-0";
    }
    return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  };

  // Diagonal repeated watermark text that adapts to container size
  const renderDiagonalTextLines = () => {
    if (!watermark.text) return null;

    const { width, height } = dimensions;

    // Fallback when we don't know size yet
    const effectiveHeight = height || 300;
    const effectiveWidth = width || 300;

    const lineSpacing = 100; // px between diagonal bands
    const lineCount = Math.ceil(effectiveHeight / lineSpacing) + 2;

    // Rough estimate for how many repeats we need per line to span width
    const approxWordWidth = Math.max(60, watermark.text.length * 8);
    const repeatPerLine = Math.ceil(effectiveWidth / approxWordWidth) + 2;

    return Array.from({ length: lineCount }, (_, index) => {
      const topPercent = ((index - 1) / (lineCount - 1)) * 100;

      return (
        <div
          key={index}
          className="absolute text-white font-semibold select-none whitespace-nowrap"
          style={{
            top: `${topPercent}%`,
            left: "-30%",
            transform: "rotate(-28deg)",
            transformOrigin: "center",
          }}
        >
          {Array.from({ length: repeatPerLine }).map((_, wordIndex) => (
            <span key={wordIndex} className="mr-6">
              {watermark.text}
            </span>
          ))}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
    >
      {/* Diagonal watermark text overlay */}
      {watermark.text && (
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            opacity: watermark.opacity ? watermark.opacity / 100 : 0.25,
            fontSize: Math.max(10, Math.min(18, 180 / watermark.text.length)),
          }}
        >
          {renderDiagonalTextLines()}
        </div>
      )}

      {/* Optional watermark image */}
      {watermark.image && (
        <div className={`absolute ${getWaterMarkPosition()}`}>
          <Image
            src={watermark.image}
            alt="Watermark"
            width={80}
            height={80}
            className="object-contain max-w-[80px] max-h-[80px]"
            style={{
              opacity: watermark.opacity ? watermark.opacity / 100 : 0.3,
            }}
          />
        </div>
      )}
    </div>
  );
}
