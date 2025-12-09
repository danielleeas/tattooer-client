/**
 * Time slot blocking utilities for scheduling conflicts
 * Handles blocking time slots based on existing events, meeting duration, and break time
 */

export interface TimeSlot {
  time: string; // Time string in format "09:00 AM" or "09:00"
  date: string; // Date string in format "YYYY-MM-DD"
}

export interface Event {
  start_date: string; // ISO datetime string
  end_date: string; // ISO datetime string
}

/**
 * Convert time string to minutes since midnight
 * Handles both 12-hour format ("09:00 AM") and 24-hour format ("09:00")
 */
export function timeToMinutes(timeStr: string): number {
  let hours: number, minutes: number;
  let period: string | undefined;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [timePart, periodPart] = timeStr.split(" ");
    [hours, minutes] = timePart.split(":").map(Number);
    period = periodPart;

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  } else {
    [hours, minutes] = timeStr.split(":").map(Number);
  }

  return hours * 60 + minutes;
}

/**
 * Get events that occur on a specific date
 */
export function getEventsForDate(dateStr: string, events: Event[]): Event[] {
  // Parse target date as local date (YYYY-MM-DD)
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dateEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

  return events.filter((event) => {
    // Parse event dates as local times
    let eventStart: Date, eventEnd: Date;
    try {
      const startStr = event.start_date;
      const endStr = event.end_date;

      if (typeof startStr === "string" && startStr.includes(" ")) {
        const [datePart, timePart] = startStr.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [h, min] = timePart.split(":").map(Number);
        eventStart = new Date(y, m - 1, d, h, min);
      } else {
        eventStart = new Date(startStr);
      }

      if (typeof endStr === "string" && endStr.includes(" ")) {
        const [datePart, timePart] = endStr.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [h, min] = timePart.split(":").map(Number);
        eventEnd = new Date(y, m - 1, d, h, min);
      } else {
        eventEnd = new Date(endStr);
      }
    } catch {
      return false;
    }

    const overlaps = eventStart <= dateEnd && eventEnd >= dateStart;

    return overlaps;
  });
}

/**
 * Check if a time slot conflicts with any events
 *
 * Logic:
 * - A time slot is blocked if the meeting time range overlaps with any event's blocked range
 * - Meeting time range: [slot_time, slot_time + duration + break_time]
 * - Event blocked range: [event_start_time, event_end_time + break_time]
 * - The break_time after event end prevents new meetings from starting immediately after an event
 * - Block if there's any overlap between these ranges
 *
 * @param timeSlot - The time slot to check (e.g., "09:00 AM")
 * @param dateStr - The date string (e.g., "2024-12-26")
 * @param events - Array of events for that date
 * @param duration - Meeting duration in minutes
 * @param breakTime - Break time after meeting in minutes (also applies after events)
 * @returns true if the time slot is blocked, false otherwise
 *
 * @example
 * // Event: 10:00-11:00, break: 30 mins
 * // Event blocked range: 10:00-11:30
 * // Slot: 11:00 AM, duration: 60 mins, break: 0 mins
 * // Meeting: 11:00-12:00 overlaps with Event blocked: 10:00-11:30 -> BLOCKED
 *
 * @example
 * // Event: 10:00-11:00, break: 30 mins
 * // Event blocked range: 10:00-11:30
 * // Slot: 11:30 AM, duration: 60 mins, break: 0 mins
 * // Meeting: 11:30-12:30, Event blocked: 10:00-11:30 -> No overlap -> ALLOWED
 */
export function isTimeSlotBlocked(
  timeSlot: string,
  dateStr: string,
  events: Event[],
  duration: number,
  breakTime: number
): boolean {
  if (!events || events.length === 0) return false;

  const dateEvents = getEventsForDate(dateStr, events);
  if (dateEvents.length === 0) return false;

  // Parse the selected date
  const [year, month, day] = dateStr.split("-").map(Number);

  // Parse time slot to get hours and minutes
  let slotHours: number, slotMinutes: number;
  if (timeSlot.includes("AM") || timeSlot.includes("PM")) {
    // Handle 12-hour format: "09:00 AM" or "02:30 PM"
    const [timePart, periodPart] = timeSlot.split(" ");
    [slotHours, slotMinutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format
    if (periodPart === "PM" && slotHours !== 12) slotHours += 12;
    if (periodPart === "AM" && slotHours === 12) slotHours = 0;
  } else {
    // Handle 24-hour format: "09:00" or "14:30"
    [slotHours, slotMinutes] = timeSlot.split(":").map(Number);
  }

  // Create meeting start and end Date objects
  const meetingStart = new Date(year, month - 1, day, slotHours, slotMinutes);
  const meetingEnd = new Date(meetingStart);
  meetingEnd.setMinutes(meetingEnd.getMinutes() + duration + breakTime);

  // Check if meeting time range overlaps with any event's time range
  return dateEvents.some((event) => {
    // Parse event start and end times as local Date objects
    let eventStart: Date;
    let eventEnd: Date;

    try {
      // Parse event start time
      const eventStartStr = event.start_date;
      if (typeof eventStartStr === "string" && eventStartStr.includes(" ")) {
        const [datePart, timePart] = eventStartStr.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [h, min] = timePart.split(":").map(Number);
        eventStart = new Date(y, m - 1, d, h, min);
      } else {
        eventStart = new Date(eventStartStr);
      }

      // Parse event end time
      const eventEndStr = event.end_date;
      if (typeof eventEndStr === "string" && eventEndStr.includes(" ")) {
        const [datePart, timePart] = eventEndStr.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [h, min] = timePart.split(":").map(Number);
        eventEnd = new Date(y, m - 1, d, h, min);
      } else {
        eventEnd = new Date(eventEndStr);
      }
    } catch {
      return false;
    }

    // Calculate event blocked end time (event end + break time)
    const eventBlockedEnd = new Date(eventEnd);
    eventBlockedEnd.setMinutes(eventBlockedEnd.getMinutes() + breakTime);

    // Check if meeting time range overlaps with event's blocked time range
    // Event blocked range: [eventStart, eventBlockedEnd]
    // Two ranges overlap if: meetingStart < eventBlockedEnd && meetingEnd > eventStart
    const overlaps = meetingStart < eventBlockedEnd && meetingEnd > eventStart;

    return overlaps;
  });
}

/**
 * Filter out blocked time slots from an array
 *
 * @param timeSlots - Array of time slot strings
 * @param dateStr - The date string (e.g., "2024-12-26")
 * @param events - Array of events for that date
 * @param duration - Meeting duration in minutes
 * @param breakTime - Break time after meeting in minutes
 * @returns Array of available (non-blocked) time slots
 */
export function getAvailableTimeSlots(
  timeSlots: string[],
  dateStr: string,
  events: Event[],
  duration: number,
  breakTime: number
): string[] {
  return timeSlots.filter(
    (slot) => !isTimeSlotBlocked(slot, dateStr, events, duration, breakTime)
  );
}

/**
 * Get all blocked time slots for a date
 *
 * @param timeSlots - Array of time slot strings
 * @param dateStr - The date string (e.g., "2024-12-26")
 * @param events - Array of events for that date
 * @param duration - Meeting duration in minutes
 * @param breakTime - Break time after meeting in minutes
 * @returns Set of blocked time slot strings
 */
export function getBlockedTimeSlots(
  timeSlots: string[],
  dateStr: string,
  events: Event[],
  duration: number,
  breakTime: number
): Set<string> {
  const blocked = new Set<string>();
  timeSlots.forEach((slot) => {
    const isBlocked = isTimeSlotBlocked(
      slot,
      dateStr,
      events,
      duration,
      breakTime
    );
    if (isBlocked) {
      blocked.add(slot);
    }
  });

  return blocked;
}
