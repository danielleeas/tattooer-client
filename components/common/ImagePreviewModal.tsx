"use client";

import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { WatermarkOverlay } from "./WatermarkOverlay";

interface WatermarkSettings {
  enabled: boolean;
  image?: string | null;
  opacity?: number | null;
  position?: string | null;
  text?: string | null;
}

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt?: string;
  watermark?: WatermarkSettings | null;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  alt = "Image preview",
  watermark,
}: ImagePreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="p-0 bg-black/95 border-0 w-auto h-auto max-w-[90vw] max-h-[90vh] rounded-2xl">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={800}
            className="h-auto w-auto max-w-[70vw] max-h-[90vh] object-contain"
            onClick={onClose}
            style={{ cursor: "zoom-out" }}
          />
          {/* Optional watermark overlay (used for Flash previews) */}
          {watermark && <WatermarkOverlay watermark={watermark} />}
        </div>
      </DialogContent>
      <DialogClose asChild>
        <Button variant="outline" className="rounded-full py-4">
          Close
        </Button>
      </DialogClose>
    </Dialog>
  );
}
