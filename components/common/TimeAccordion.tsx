"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";
import {
  getBlockedTimeSlots,
  type Event as TimeSlotEvent,
} from "@/lib/utils/time-slots";

interface DateTime {
  date: string;
  time: string;
}

// Type for consult_start_times: { "mon": ["09:00", "10:00"], "tue": [...], ... }
type ConsultStartTimes = Record<string, string[]>;
type Event = Database["public"]["Tables"]["events"]["Row"];

interface TimeAccordionProps {
  selectedDates: string[];
  selectedDateTimes: DateTime[];
  onDateTimesSelect: (dateTimes: DateTime[]) => void;
  timeSlots?: string[];
  consultStartTimes?: ConsultStartTimes | null;
  events?: Event[];
  consultDuration?: number; // in minutes
  breakTime?: number; // in minutes
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

// Map JavaScript day numbers (0 = Sunday) to day abbreviations
const DAY_NUMBER_TO_ABBREV: Record<number, string> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

// Format time from "09:00" to "09:00 AM" or "14:00" to "02:00 PM"
const formatTime = (timeStr: string): string => {
  // If already formatted (contains AM/PM), return as is
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    return timeStr;
  }

  // Parse 24-hour format
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
};

// Get day abbreviation from date string (YYYY-MM-DD)
const getDayAbbrevFromDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  return DAY_NUMBER_TO_ABBREV[dayOfWeek] || "sun";
};

// Get time slots for a specific date from consult_start_times
const getTimeSlotsForDate = (
  dateStr: string,
  consultStartTimes?: ConsultStartTimes | null
): string[] => {
  if (!consultStartTimes) {
    return defaultTimeSlots;
  }

  const dayAbbrev = getDayAbbrevFromDate(dateStr);
  const rawTimeSlots = consultStartTimes[dayAbbrev] || [];

  // Format the time slots
  return rawTimeSlots.map(formatTime);
};

export function TimeAccordion({
  selectedDates,
  selectedDateTimes,
  onDateTimesSelect,
  timeSlots,
  consultStartTimes,
  events = [],
  consultDuration = 60,
  breakTime = 0,
  className = "",
}: TimeAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Memoize time slots map for each date to avoid recalculations
  const dateTimeSlotsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    selectedDates.forEach((dateStr) => {
      if (consultStartTimes) {
        map.set(dateStr, getTimeSlotsForDate(dateStr, consultStartTimes));
      } else if (timeSlots) {
        map.set(dateStr, timeSlots);
      } else {
        map.set(dateStr, defaultTimeSlots);
      }
    });
    return map;
  }, [selectedDates, consultStartTimes, timeSlots]);

  // Memoize blocked time slots for each date using helper function
  const blockedTimeSlotsMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    selectedDates.forEach((dateStr) => {
      const timeSlotsForDate = dateTimeSlotsMap.get(dateStr) || [];
      const blocked = getBlockedTimeSlots(
        timeSlotsForDate,
        dateStr,
        events as TimeSlotEvent[],
        consultDuration,
        breakTime
      );
      map.set(dateStr, blocked);
    });
    return map;
  }, [selectedDates, dateTimeSlotsMap, events, consultDuration, breakTime]);

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
                  {(dateTimeSlotsMap.get(dateStr) || defaultTimeSlots).map(
                    (timeSlot) => {
                      const isSelected = selectedTime === timeSlot;
                      const isBlocked =
                        blockedTimeSlotsMap.get(dateStr)?.has(timeSlot) ||
                        false;
                      return (
                        <Button
                          key={timeSlot}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          disabled={isBlocked}
                          onClick={() => handleTimeSelect(dateStr, timeSlot)}
                          className={cn(
                            "text-xs rounded-full",
                            isSelected
                              ? "bg-foreground text-background"
                              : isBlocked
                              ? "bg-background text-muted-foreground opacity-50 cursor-not-allowed"
                              : "bg-background text-foreground"
                          )}
                        >
                          {timeSlot}
                        </Button>
                      );
                    }
                  )}
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
