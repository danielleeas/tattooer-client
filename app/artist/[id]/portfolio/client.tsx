"use client";

import { useState } from "react";
import { BackButton } from "@/components/artist/BackButton";
import { PortfolioGrid } from "@/components/artist/PortfolioGrid";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";
import type { Database } from "@/types/supabase";
import { SectionHeader } from "@/components/common/SectionHeader";

type Portfolio = Database["public"]["Tables"]["artist_portfolios"]["Row"];

interface PortfolioClientProps {
  portfolios: Portfolio[];
  artistId: string;
}

export function PortfolioClient({
  portfolios,
  artistId,
}: PortfolioClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    if (portfolio.portfolio_image) {
      setSelectedImage(portfolio.portfolio_image);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const basePath = `/artist/${artistId}`;

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
        {/* Back Button */}
        <BackButton href={basePath} />

        {/* Portfolio Header */}
        <SectionHeader
          icon="/assets/images/icons/portfolio.png"
          title="Portfolio"
          description="Take A Browse Through My Work For Inspiration!"
          className="px-10 h-[180px]"
        />

        {/* Portfolio Grid */}
        <PortfolioGrid
          portfolios={portfolios}
          onPortfolioClick={handlePortfolioClick}
        />
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImage}
        alt="Portfolio image preview"
      />
    </>
  );
}
