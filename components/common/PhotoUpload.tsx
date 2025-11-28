"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PhotoUploadProps {
  photos: string[];
  onPhotoUpload: (files: FileList) => void;
  onPhotoRemove: (index: number) => void;
  maxPhotos?: number;
  label?: string;
  className?: string;
}

export function PhotoUpload({
  photos,
  onPhotoUpload,
  onPhotoRemove,
  maxPhotos = 5,
  label = "Upload Photos",
  className = "",
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    onPhotoUpload(files);

    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5" />
        <Label className="text-base font-semibold">
          {label} (Max {maxPhotos})
        </Label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={photos.length >= maxPhotos}
        className="hidden"
      />

      <div
        onClick={handleUploadClick}
        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-md cursor-pointer hover:border-primary transition-colors"
      >
        <div className="text-center">
          <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Click to upload photos
          </p>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                width={128}
                height={128}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => onPhotoRemove(index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
