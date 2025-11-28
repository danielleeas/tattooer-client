import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { FlashCard } from "./FlashCard";
import Image from "next/image";
import { Button } from "../ui/button";
import { SectionHeader } from "../common/SectionHeader";

interface FlashDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  flash: {
    id: string;
    flash_image: string | null;
    flash_name: string | null;
    flash_price: number;
    repeatable: boolean;
  } | null;
}

export function FlashDrawer({ isOpen, onClose, flash }: FlashDrawerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        variant="drawer"
        className="px-6 pb-8 bg-secondary rounded-3xl!"
      >
        {/* Content */}
        <div className="space-y-6">
          {/* Dialog Header */}
          <SectionHeader
            title={
              <DialogTitle>
                <p className="text-3xl font-normal">Claim This Piece?</p>
              </DialogTitle>
            }
            titleClassName="normal-case"
            description="Please double-check that you selected the correct pieces to claim."
            icon="/assets/images/icons/flash.png"
          />

          {/* Flash Grid Item */}
          {flash && (
            <div className="flex justify-center">
              <FlashCard
                image={flash.flash_image}
                name={flash.flash_name}
                price={flash.flash_price}
                className="w-[200px] h-[250px]"
              />
            </div>
          )}

          <p className="font-normal">
            Are there any modifications to this piece you’d like us to consider?
            (Ex: Color, size, placement) Changes may affect the price.{" "}
          </p>

          {/* Message Text Area */}
          <div className="space-y-2">
            <textarea
              id="flash-message"
              placeholder="Type your message here"
              className="w-full min-h-[80px] px-3 py-2 bg-transparent border border-muted-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={5}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <DialogClose asChild>
              {/* <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground bg-muted rounded-full border border-muted-foreground hover:bg-muted/80 transition-colors">
                Cancel
              </button> */}
              <Button variant="outline" className="rounded-full py-4">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" className="rounded-full py-4">
              Claim
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
