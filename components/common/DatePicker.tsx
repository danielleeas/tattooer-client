"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selectedDates?: string[];
  onDatesSelect?: (dateStrs: string[]) => void;
  isMultiple?: boolean;
  isDateAvailable?: (date: Date) => boolean;
  workDays?: string[]; // Array of day abbreviations: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  className?: string;
}

// Map day abbreviations to JavaScript day numbers (0 = Sunday, 1 = Monday, etc.)
const DAY_ABBREV_TO_NUMBER: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

// Default availability function - no weekends and no past dates
const defaultIsDateAvailable = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Don't allow past dates
  if (date < today) return false;

  const dayOfWeek = date.getDay();
  // Make weekends unavailable (you can customize this based on availability)
  return dayOfWeek !== 0 && dayOfWeek !== 6;
};

// Create availability function based on work days
const createWorkDaysAvailability = (workDays: string[]) => {
  const workDayNumbers = new Set(
    workDays
      .map((day) => DAY_ABBREV_TO_NUMBER[day.toLowerCase()])
      .filter((num) => num !== undefined)
  );

  return (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't allow past dates
    if (date < today) return false;

    // Check if the date's day of week is in the work days
    const dayOfWeek = date.getDay();
    return workDayNumbers.has(dayOfWeek);
  };
};

export function DatePicker({
  selectedDates = [],
  onDatesSelect,
  isMultiple = false,
  isDateAvailable,
  workDays,
  className = "",
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Memoize availability function to prevent unnecessary recalculations
  const availabilityFunction = useMemo(() => {
    if (isDateAvailable) {
      return isDateAvailable;
    }
    if (workDays && workDays.length > 0) {
      return createWorkDaysAvailability(workDays);
    }
    return defaultIsDateAvailable;
  }, [isDateAvailable, workDays]);

  // Parse selected date safely to avoid timezone issues
  const parseSelectedDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month: month - 1, day }; // month is 0-indexed
  };

  // Use selectedDates directly (empty array for no selection)

  const selectedDateParts = selectedDates.map((dateStr) =>
    parseSelectedDate(dateStr)
  );

  const isDateSelected = (year: number, month: number, day: number) => {
    return selectedDateParts.some(
      (parts) =>
        parts.year === year && parts.month === month && parts.day === day
    );
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    // Add nulls for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const handleDateSelect = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (!availabilityFunction(date)) return;

    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (isMultiple) {
      // Handle multiple selection
      const isCurrentlySelected = isDateSelected(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      let newSelectedDates;
      if (isCurrentlySelected) {
        // Remove the date if already selected
        newSelectedDates = selectedDates.filter((date) => date !== dateStr);
      } else {
        // Add the date if not selected
        newSelectedDates = [...selectedDates, dateStr];
      }

      if (onDatesSelect) {
        onDatesSelect(newSelectedDates);
      }
    } else {
      // Handle single selection (replace current selection)
      if (onDatesSelect) {
        onDatesSelect([dateStr]);
      }
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div
      className={`flex flex-col gap-1 bg-secondary p-4 rounded-lg ${className}`}
    >
      {isMultiple && selectedDates.length > 0 && (
        <div className="text-xs text-muted-foreground mb-2 text-center">
          {selectedDates.length} date
          {selectedDates.length !== 1 ? "s" : ""} selected
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-muted rounded-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold">
            {monthName} {year}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-muted rounded-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const isAvailable = availabilityFunction(date);
          const isSelected = isDateSelected(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          return (
            <div
              key={day}
              className="relative aspect-square flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={!isAvailable}
                className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${
                  isSelected
                    ? "bg-foreground text-background"
                    : isAvailable
                    ? "border border-muted-foreground/30 hover:border-foreground/50 cursor-pointer"
                    : "text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                {day}
              </button>
              {isSelected && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
