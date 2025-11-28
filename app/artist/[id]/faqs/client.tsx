"use client";

import { BackButton } from "@/components/artist/BackButton";
import { FAQHeader } from "@/components/artist/FAQHeader";
import { FAQAccordion } from "@/components/artist/FAQAccordion";
import { MapPin } from "lucide-react";
import type { Database } from "@/types/supabase";
import type { FAQCategoryWithItems } from "@/lib/api/artist";
import { SectionHeader } from "@/components/common/SectionHeader";

interface FAQsClientProps {
  artistId: string;
  artist: Database["public"]["Tables"]["artists"]["Row"] | null;
  faqs: FAQCategoryWithItems[];
  error: string | null;
}

export function FAQsClient({ artistId, artist, faqs, error }: FAQsClientProps) {
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
    <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
      {/* Back Button */}
      <BackButton href={basePath} />

      {/* FAQ Header */}
      <SectionHeader
        icon="/assets/images/icons/question.png"
        title="FAQs"
        description="Your questions, answered."
      />

      {/* FAQ Accordion */}
      <FAQAccordion categories={faqs} />

      {/* Contact Section */}
      <div className="mt-auto pt-8 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl text-foreground">Got another question?</h3>
          <div>
            <p className="text-muted-foreground">
              Just reach out, we&apos;re happy to help.
            </p>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-destructive" />
              <a
                href="mailto:darkoceantattoo@gmail.com"
                className="text-foreground hover:underline"
              >
                darkoceantattoo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
