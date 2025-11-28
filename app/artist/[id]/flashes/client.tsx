"use client";

import { useState } from "react";
import { BackButton } from "@/components/artist/BackButton";
import { FlashHeader } from "@/components/artist/FlashHeader";
import { FlashGrid } from "@/components/artist/FlashGrid";
import { FlashDrawer } from "@/components/artist/FlashDrawer";
import type { Database } from "@/types/supabase";
import { SectionHeader } from "@/components/common/SectionHeader";

type Flash = Database["public"]["Tables"]["artist_flashs"]["Row"];

interface FlashesClientProps {
  artistId: string;
  artist: Database["public"]["Tables"]["artists"]["Row"] | null;
  flashes: Flash[];
  error: string | null;
}

export function FlashesClient({
  artistId,
  artist,
  flashes,
  error,
}: FlashesClientProps) {
  const [selectedFlash, setSelectedFlash] = useState<Flash | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFlashClick = (flash: Flash) => {
    setSelectedFlash(flash);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedFlash(null);
  };

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-foreground">
            Artist Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || "The artist you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const basePath = `/artist/${artistId}`;

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
        {/* Back Button */}
        <BackButton href={basePath} />

        {/* Flash Header */}
        <SectionHeader
          title="Flash"
          description="Browse My Available Flash Designs!"
          icon="/assets/images/icons/flash.png"
        />

        {/* Flash Grid */}
        <FlashGrid flashes={flashes} onFlashClick={handleFlashClick} />
      </div>

      {/* Flash Drawer */}
      <FlashDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        flash={selectedFlash}
      />
    </>
  );
}
