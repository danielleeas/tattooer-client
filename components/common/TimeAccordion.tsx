"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateTime {
  date: string;
  time: string;
}

interface TimeAccordionProps {
  selectedDates: string[];
  selectedDateTimes: DateTime[];
  onDateTimesSelect: (dateTimes: DateTime[]) => void;
  timeSlots?: string[];
  className?: string;
}

const defaultTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];

export function TimeAccordion({
  selectedDates,
  selectedDateTimes,
  onDateTimesSelect,
  timeSlots = defaultTimeSlots,
  className = "",
}: TimeAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleTimeSelect = (dateStr: string, timeStr: string) => {
    const existingIndex = selectedDateTimes.findIndex(
      (dt) => dt.date === dateStr
    );
    let newDateTimes;

    if (existingIndex >= 0) {
      // Update existing date-time
      newDateTimes = [...selectedDateTimes];
      newDateTimes[existingIndex] = { date: dateStr, time: timeStr };
    } else {
      // Add new date-time
      newDateTimes = [...selectedDateTimes, { date: dateStr, time: timeStr }];
    }

    onDateTimesSelect(newDateTimes);
  };

  const getSelectedTimeForDate = (dateStr: string): string | null => {
    const dateTime = selectedDateTimes.find((dt) => dt.date === dateStr);
    return dateTime?.time || null;
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (selectedDates.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">{`Select Time${
        selectedDates.length > 1 ? "s" : ""
      }`}</h3>

      <Accordion
        type="multiple"
        value={expandedItems}
        onValueChange={setExpandedItems}
        className="space-y-2"
      >
        {selectedDates.map((dateStr) => {
          const selectedTime = getSelectedTimeForDate(dateStr);
          const formattedDate = formatDate(dateStr);

          return (
            <AccordionItem
              key={dateStr}
              value={dateStr}
              className="px-4 border-b-0"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <span className="text-base font-medium">{formattedDate}</span>
                  {selectedTime && (
                    <span className="text-sm text-muted-foreground px-2 py-1">
                      {selectedTime}
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((timeSlot) => {
                    const isSelected = selectedTime === timeSlot;
                    return (
                      <Button
                        key={timeSlot}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeSelect(dateStr, timeSlot)}
                        className={cn(
                          "text-xs rounded-full",
                          isSelected
                            ? "bg-foreground text-background"
                            : "bg-background text-foreground"
                        )}
                      >
                        {timeSlot}
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* {selectedDateTimes.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-3">
            Selected Appointments ({selectedDateTimes.length})
          </h4>
          <div className="space-y-2">
            {selectedDateTimes.map((dateTime) => (
              <div
                key={dateTime.date}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{formatDate(dateTime.date)}</span>
                <span className="text-muted-foreground">{dateTime.time}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
