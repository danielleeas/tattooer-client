"use client";

interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  className?: string;
}

export function TimeSlotSelector({
  timeSlots,
  selectedTime,
  onTimeSelect,
  className = "",
}: TimeSlotSelectorProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeSelect(time)}
            className={`px-2 py-1 rounded-full border-2 transition-all ${
              selectedTime === time
                ? "border-foreground bg-muted"
                : "border-input bg-background hover:border-foreground/50"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
