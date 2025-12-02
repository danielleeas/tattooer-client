"use client";

import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt?: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  alt = "Image preview",
}: ImagePreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="max-w-[390px] h-[480px] p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-contain max-h-[90vh] max-w-[90vw]"
            onClick={onClose}
            style={{ cursor: "zoom-out" }}
          />
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
