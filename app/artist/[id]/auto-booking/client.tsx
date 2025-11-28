"use client";

import { useState } from "react";
import { BackButton } from "@/components/artist/BackButton";
import { DatePicker, TimeSlotSelector } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, AlertCircle } from "lucide-react";
import type { Database } from "@/types/supabase";
import Image from "next/image";

interface AutoBookingClientProps {
  artistId: string;
  artist: Database["public"]["Tables"]["artists"]["Row"] | null;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  error: string | null;
}

export function AutoBookingClient({
  artistId,
  artist,
  locations,
  error,
}: AutoBookingClientProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [numberOfSessions, setNumberOfSessions] = useState<number>(3);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Sample time slots - in real app, these would come from API
  const timeSlots = [
    "09:15 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:30 PM",
  ];

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

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const calculateDateRange = () => {
    if (!selectedDate) return null;

    const startDate = new Date(selectedDate);
    // Calculate end date based on number of sessions (assuming sessions are daily)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + numberOfSessions - 1);

    return {
      start: startDate,
      end: endDate,
    };
  };

  const formatDateRange = () => {
    if (!selectedDate) return "Select dates";

    const range = calculateDateRange();
    if (!range) return formatDate(selectedDate);

    const start = range.start;
    const end = range.end;

    const startMonth = start.toLocaleString("default", { month: "short" });
    const endMonth = end.toLocaleString("default", { month: "short" });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleConfirmAppointments = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }
    // TODO: Handle appointment confirmation
    const range = calculateDateRange();
    console.log("Confirming appointments:", {
      date: selectedDate,
      time: selectedTime,
      dateRange: range,
      numberOfSessions,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
      {/* Back Button */}
      <BackButton href={basePath} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Image
            src={"/assets/images/icons/appointment.png"}
            alt="Appointment"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h1 className="text-lg text-foreground text-center uppercase tracking-wide">
          PICK YOUR DATES
        </h1>
      </div>

      {/* Date Selection Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Tap to Select Your Dates</h2>

        <div className="flex items-center justify-between">
          <span className="text-xl">Date Range</span>
          <span className="text-xl">{formatDateRange()}</span>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sessions" className="text-xl">
            Number of Sessions
          </Label>
          <Input
            id="sessions"
            type="number"
            min="1"
            value={numberOfSessions}
            onChange={(e) => setNumberOfSessions(parseInt(e.target.value) || 1)}
            className="w-20 h-8 text-center bg-background border-input"
          />
        </div>

        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 bg-secondary border border-muted rounded-md">
          <AlertCircle className="w-5 h-5 text-foreground" />
          <p className="leading-snug">
            Back to back sessions are available for your project!
          </p>
        </div>
      </div>

      {/* Calendar */}
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        className="w-full"
      />

      {/* Selected Date and Time Confirmation */}
      {selectedDate && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl">
            Selected Date - {formatDate(selectedDate)}
          </h2>

          <TimeSlotSelector
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />

          <Button
            onClick={handleConfirmAppointments}
            className="w-full rounded-full py-3 text-base"
            size="lg"
            disabled={!selectedTime}
          >
            Confirm Appointments
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-snug">
            Confirm your dates to temporarily hold your spot, then send your
            deposit below.
          </p>
        </div>
      )}

      {/* Payment Deposit Methods */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl">Ways to pay your deposit</h2>

        <div className="flex flex-col gap-4">
          {/* Credit Card */}
          <div className="grid grid-cols-2">
            <span className="text-xl">Credit Card</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                copyToClipboard("bookings@tattooartist.com", "credit-card")
              }
            >
              {copiedItem === "credit-card"
                ? "Copied!"
                : "Pay with Stripe/Square"}
            </Button>
          </div>

          {/* E-Transfer */}
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xl">E-Transfer</span>
              <span className="text-xs text-muted-foreground">Canada Only</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                copyToClipboard("payments@tattooartist.com", "etransfer")
              }
            >
              {copiedItem === "etransfer" ? "Copied!" : "Email or phone number"}
            </Button>
          </div>

          {/* PayPal */}
          <div className="grid grid-cols-2">
            <span className="text-xl">Paypal</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  copyToClipboard(
                    "https://paypal.me/tattooartist",
                    "paypal-link"
                  )
                }
              >
                {copiedItem === "paypal-link" ? "Copied!" : "Paypal Link"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  copyToClipboard("paypal@tattooartist.com", "paypal-email")
                }
              >
                {copiedItem === "paypal-email" ? "Copied!" : "Email"}
              </Button>
            </div>
          </div>

          {/* Venmo */}
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xl">Venmo</span>
              <span className="text-xs text-muted-foreground">US Only</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => copyToClipboard("@tattooartist", "venmo")}
            >
              {copiedItem === "venmo" ? "Copied!" : "Email or phone number"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
