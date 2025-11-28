"use client";

import { useState } from "react";
import {
  useForm,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { BackButton } from "@/components/artist/BackButton";
import { BookingHeader } from "@/components/artist/BookingHeader";
import { PhotoUpload } from "@/components/common/PhotoUpload";
import { DatePicker } from "@/components/common/DatePicker";
import { TimeSlotSelector } from "@/components/common/TimeSlotSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Video, Users } from "lucide-react";
import type { Database } from "@/types/supabase";

interface ConsultClientProps {
  artistId: string;
  artist: Database["public"]["Tables"]["artists"]["Row"] | null;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  error: string | null;
}

interface ConsultFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  cityCountry: string;
  location: string;
  consultationType: "online" | "in-person";
  selectedDate: string;
  selectedTime: string;
  tattooIdea: string;
  tattooType: "coverup" | "addon" | "between" | "";
  referencePhotos: File[];
}

export function ConsultClient({
  artistId,
  artist,
  locations,
  error,
}: ConsultClientProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConsultFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      cityCountry: "",
      location: "",
      consultationType: "online",
      selectedDate: "",
      selectedTime: "",
      tattooIdea: "",
      tattooType: "",
      referencePhotos: [],
    },
    mode: "onChange",
  });

  const consultationType = watch("consultationType");
  const location = watch("location");
  const tattooType = watch("tattooType");
  const selectedDate = watch("selectedDate");
  const selectedTime = watch("selectedTime");

  const onSubmit = async (data: ConsultFormData) => {
    console.log("Consult form submitted:", data);
    // TODO: Submit to API
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
      {/* Back Button */}
      <BackButton href={basePath} />

      {/* Booking Header */}
      <BookingHeader
        artistName={artist.full_name || "Artist"}
        title={`Book a consult`}
        icon="/assets/images/icons/video_camera.png"
      />

      {/* Consult Form */}
      <ConsultFormContent
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        locations={locations}
        consultationType={consultationType}
        location={location}
        tattooType={tattooType}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        uploadedPhotos={uploadedPhotos}
        setUploadedPhotos={setUploadedPhotos}
      />
    </div>
  );
}

interface ConsultFormContentProps {
  register: UseFormRegister<ConsultFormData>;
  handleSubmit: UseFormHandleSubmit<ConsultFormData>;
  setValue: UseFormSetValue<ConsultFormData>;
  errors: FieldErrors<ConsultFormData>;
  isSubmitting: boolean;
  onSubmit: (data: ConsultFormData) => void;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  consultationType: "online" | "in-person";
  location: string;
  tattooType: "coverup" | "addon" | "between" | "";
  selectedDate: string;
  selectedTime: string;
  uploadedPhotos: string[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const ConsultFormContent = ({
  register,
  handleSubmit,
  setValue,
  errors,
  isSubmitting,
  onSubmit,
  locations,
  consultationType,
  location,
  tattooType,
  selectedDate,
  selectedTime,
  uploadedPhotos,
  setUploadedPhotos,
}: ConsultFormContentProps) => {
  // Available time slots
  const timeSlots = [
    "09:15 AM",
    "10:00 AM",
    "11.30 AM",
    "01.45 PM",
    "03:30 PM",
    "05:00 PM",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName" className="text-base font-semibold">
          Full Name
        </Label>
        <Input
          id="fullName"
          placeholder="First and last, please"
          {...register("fullName", { required: "Full name is required" })}
          className="bg-background border-input"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-base font-semibold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="bg-background border-input"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="phoneNumber" className="text-base font-semibold">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...register("phoneNumber", {
            required: "Phone number is required",
          })}
          className="bg-background border-input"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* City & Country */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="cityCountry" className="text-base font-semibold">
          City & Country of Residence
        </Label>
        <Input
          id="cityCountry"
          placeholder="Toronto, Canada"
          {...register("cityCountry", {
            required: "City and country is required",
          })}
          className="bg-background border-input"
        />
        {errors.cityCountry && (
          <p className="text-sm text-destructive">
            {errors.cityCountry.message}
          </p>
        )}
      </div>

      {/* Tattoo Booking Location */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="location" className="text-base font-semibold">
          Tattoo Booking Location
        </Label>
        <Select
          value={location}
          onValueChange={(value) => {
            setValue("location", value, { shouldValidate: true });
          }}
        >
          <input
            type="hidden"
            {...register("location", {
              required: "Please select a location",
            })}
          />
          <SelectTrigger className="bg-background border-input">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Tattoo Idea */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tattooIdea" className="text-base font-semibold">
          Please Tell Me Your Tattoo Idea
        </Label>
        <Textarea
          id="tattooIdea"
          placeholder="Describe your tattoo idea..."
          rows={6}
          {...register("tattooIdea", { required: "Tattoo idea is required" })}
        />
        {errors.tattooIdea && (
          <p className="text-sm text-destructive">
            {errors.tattooIdea.message}
          </p>
        )}
      </div>

      {/* Tattoo Type */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tattooType" className="text-base font-semibold">
          Is this a coverup/add on/or between existing tattoos?
        </Label>
        <Select
          value={tattooType}
          onValueChange={(value) =>
            setValue("tattooType", value as "coverup" | "addon" | "between")
          }
        >
          <SelectTrigger className="bg-background border-input">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coverup">Cover Up</SelectItem>
            <SelectItem value="addon">Add On</SelectItem>
            <SelectItem value="between">Between Existing Tattoos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upload Reference Photos */}
      <PhotoUpload
        photos={uploadedPhotos}
        onPhotoUpload={(files) => {
          const remainingSlots = 5 - uploadedPhotos.length;
          Array.from(files)
            .slice(0, remainingSlots)
            .forEach((file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const result = reader.result as string;
                setUploadedPhotos((prev) => [...prev, result]);
              };
              reader.readAsDataURL(file);
            });
        }}
        onPhotoRemove={(index) => {
          setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
        }}
        maxPhotos={5}
        label="Upload Reference Photos (Max 5)"
      />

      {/* Consultation Type Selection */}
      <div className="flex flex-col gap-3">
        <Label className="text-base font-semibold">Consultation Type</Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue("consultationType", "online")}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              consultationType === "online"
                ? "border-foreground bg-muted"
                : "border-input bg-background"
            }`}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm font-medium">ONLINE CONSULTATION</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("consultationType", "in-person")}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              consultationType === "in-person"
                ? "border-foreground bg-muted"
                : "border-input bg-background"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium">IN-PERSON</span>
          </button>
        </div>
        <input
          type="hidden"
          {...register("consultationType", {
            required: "Please select a consultation type",
          })}
        />
        {errors.consultationType && (
          <p className="text-sm text-destructive">
            {errors.consultationType.message}
          </p>
        )}
      </div>

      {/* Calendar */}
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={(dateStr) =>
          setValue("selectedDate", dateStr, { shouldValidate: true })
        }
      />
      <input
        type="hidden"
        {...register("selectedDate", {
          required: "Please select a date",
        })}
      />
      {errors.selectedDate && (
        <p className="text-sm text-destructive">
          {errors.selectedDate.message}
        </p>
      )}

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="flex flex-col gap-2">
          <Label className="text-base font-semibold">
            Selected Date -{" "}
            {(() => {
              const [year, month, day] = selectedDate.split("-").map(Number);
              const date = new Date(year, month - 1, day);
              return date.toLocaleDateString("default", {
                month: "long",
                day: "numeric",
              });
            })()}
          </Label>
        </div>
      )}

      {/* Time Slot Selection */}
      {selectedDate && (
        <>
          <TimeSlotSelector
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            onTimeSelect={(time) =>
              setValue("selectedTime", time, { shouldValidate: true })
            }
          />
          <input
            type="hidden"
            {...register("selectedTime", {
              required: "Please select a time slot",
            })}
          />
          {errors.selectedTime && (
            <p className="text-sm text-destructive">
              {errors.selectedTime.message}
            </p>
          )}
        </>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full"
        size="lg"
      >
        {isSubmitting ? "Submitting..." : "Click Here to Confirm"}
      </Button>
    </form>
  );
};
