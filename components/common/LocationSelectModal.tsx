import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";
import { cn } from "@/lib/utils";

interface LocationSelectModalProps {
  value?: string;
  onValueChange: (value: string) => void;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  placeholder?: string;
}

export function LocationSelectModal({
  value,
  onValueChange,
  locations,
  placeholder = "Select a location",
}: LocationSelectModalProps) {
  const [open, setOpen] = useState(false);

  const selectedLocation = locations.find((loc) => loc.id === value);

  const handleSelect = (locationId: string) => {
    onValueChange(locationId);
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
            <div className="text-sm truncate">
              {selectedLocation ? selectedLocation.address : placeholder}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[380px] rounded-lg max-h-[500px] overflow-y-auto">
        <DialogTitle className="text-center">Select a Location</DialogTitle>
        <div className="space-y-1">
          {locations.map((location) => (
            <Button
              key={location.id}
              variant={value === location.id ? "default" : "outline"}
              className={cn(
                "w-full justify-start px-4 py-2 text-left h-auto bg-background border-0 rounded-lg hover:bg-secondary hover:border-muted hover:text-secondary-foreground",
                value === location.id &&
                  "bg-secondary border border-muted text-secondary-foreground"
              )}
              onClick={() => handleSelect(location.id)}
            >
              <div className="text-sm wrap-break-word whitespace-pre-wrap overflow-hidden py-1">
                {location.address}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
