"use client";
import { useState } from "react";
import { Palette, Plus, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TattooTypeSelectModalProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const tattooTypes = [
  {
    id: "coverup",
    label: "Cover Up",
    description: "Covering existing tattoo work",
    icon: Palette,
  },
  {
    id: "addon",
    label: "Add On",
    description: "Adding to existing tattoo designs",
    icon: Plus,
  },
  {
    id: "between",
    label: "Between Existing Tattoos",
    description: "Placement between current tattoos",
    icon: ArrowRight,
  },
];

export function TattooTypeSelectModal({
  value,
  onValueChange,
  placeholder = "Select an option",
}: TattooTypeSelectModalProps) {
  const [open, setOpen] = useState(false);

  const selectedType = tattooTypes.find((type) => type.id === value);

  const handleSelect = (typeId: string) => {
    onValueChange(typeId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-background border-input px-4 py-2 text-left"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="text-base">
              {selectedType ? selectedType.label : placeholder}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[370px] rounded-lg max-h-[500px] overflow-y-auto">
        <DialogTitle className="text-center" />
        <div className="space-y-1">
          {tattooTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={value === type.id ? "default" : "outline"}
                onClick={() => handleSelect(type.id)}
                className={cn(
                  "w-full justify-start px-4 py-2 text-left bg-background border-0 rounded-lg hover:bg-secondary hover:border-muted hover:text-secondary-foreground",
                  value === type.id &&
                    "bg-secondary border border-muted text-secondary-foreground"
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="text-sm">{type.label}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
