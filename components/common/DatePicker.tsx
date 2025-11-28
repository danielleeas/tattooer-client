"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selectedDate: string | null;
  onDateSelect: (dateStr: string) => void;
  isDateAvailable?: (date: Date) => boolean;
  className?: string;
}

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

export function DatePicker({
  selectedDate,
  onDateSelect,
  isDateAvailable = defaultIsDateAvailable,
  className = "",
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Parse selected date safely to avoid timezone issues
  const parseSelectedDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month: month - 1, day }; // month is 0-indexed
  };

  const selectedDateParts = selectedDate
    ? parseSelectedDate(selectedDate)
    : null;
  const selectedDay = selectedDateParts?.day || null;
  const selectedMonth = selectedDateParts?.month || null;
  const selectedYear = selectedDateParts?.year || null;

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
    if (!isDateAvailable(date)) return;

    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect(dateStr);
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
      className={`flex flex-col gap-3 bg-secondary p-4 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-muted rounded-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthName} {year}
        </h3>
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
          const isAvailable = isDateAvailable(date);
          const isSelected =
            selectedDay === day &&
            selectedMonth === currentMonth.getMonth() &&
            selectedYear === currentMonth.getFullYear();

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
