"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FieldErrors,
  Controller,
  Control,
} from "react-hook-form";
import { BackButton } from "@/components/artist/BackButton";
import { PhotoUpload } from "@/components/common/PhotoUpload";
import { DatePicker, TimeAccordion } from "@/components/common";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Video, Users } from "lucide-react";
import type { Database } from "@/types/supabase";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LocationSelectModal,
  TattooTypeSelectModal,
} from "@/components/common";
import type { ArtistInfo } from "@/types/artist";

interface ConsultClientProps {
  artistId: string;
  artist: ArtistInfo | null;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  error: string | null;
  artistName: string;
}

interface DateTime {
  date: string;
  time: string;
}

interface ConsultFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  cityCountry: string;
  location: string;
  consultationType: "online" | "in-person";
  selectedDateTimes: DateTime[];
  tattooIdea: string;
  tattooType: "coverup" | "addon" | "between" | "";
  referencePhotos: File[];
  legalAge: boolean;
  agreeToPolicies: boolean;
}

export function ConsultClient({
  artistId,
  artistName,
  artist,
  locations,
  error,
}: ConsultClientProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [events, setEvents] = useState<
    Database["public"]["Tables"]["events"]["Row"][]
  >([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
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
      selectedDateTimes: [],
      tattooIdea: "",
      tattooType: "",
      referencePhotos: [],
      legalAge: false,
      agreeToPolicies: false,
    },
    mode: "onChange",
  });

  const consultationType = watch("consultationType");
  const location = watch("location");
  const tattooType = watch("tattooType");
  const selectedDateTimes = watch("selectedDateTimes");

  const onSubmit = async (data: ConsultFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { submitConsultRequest } = await import("./actions");

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("artistId", artistId);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("cityCountry", data.cityCountry);
      formData.append("locationId", data.location);
      formData.append("consultationType", data.consultationType);
      formData.append("tattooIdea", data.tattooIdea);
      formData.append("tattooType", data.tattooType);
      formData.append(
        "selectedDateTimes",
        JSON.stringify(data.selectedDateTimes)
      );

      // Append all photo files
      uploadedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const result = await submitConsultRequest(formData);

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.error || "Failed to submit consultation request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request"
      );
    }
  };

  useEffect(() => {
    if (artist) {
      setValue(
        "consultationType",
        artist.flow?.consult_online ? "online" : "in-person"
      );
    }
  }, [artist, setValue]);

  // Fetch events when selected dates change
  useEffect(() => {
    const fetchEvents = async () => {
      const selectedDates = selectedDateTimes.map((dt) => dt.date);
      if (selectedDates.length === 0) {
        setEvents([]);
        return;
      }

      try {
        const { fetchEventsForDates } = await import("./actions");
        const fetchedEvents = await fetchEventsForDates(
          artistId,
          selectedDates
        );
        setEvents(fetchedEvents);

        console.log("fetchedEvents :: ", fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [selectedDateTimes, artistId]);

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

  const basePath = `/artist/${artistName}`;

  return (
    <div className="min-h-screen bg-background flex flex-col w-full px-4 py-6 gap-8">
      {/* Back Button */}
      <BackButton href={basePath} />

      {/* Booking Header */}
      <SectionHeader
        artistName={artist.full_name || "Artist"}
        title={
          <p>
            Book a<br /> Consult
          </p>
        }
        icon="/assets/images/icons/video_camera.png"
        description="Please tell us about yourself and your idea!"
      />

      {/* Consult Form */}
      <ConsultFormContent
        artist={artist}
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        locations={locations}
        consultationType={consultationType}
        location={location}
        tattooType={tattooType}
        selectedDateTimes={selectedDateTimes}
        uploadedPhotos={uploadedPhotos}
        setUploadedPhotos={setUploadedPhotos}
        setUploadedFiles={setUploadedFiles}
        submitError={submitError}
        submitSuccess={submitSuccess}
        events={events}
        consultDuration={artist?.flow?.consult_duration || 60}
        breakTime={artist?.flow?.break_time || 0}
      />
    </div>
  );
}

interface ConsultFormContentProps {
  artist: ArtistInfo | null;
  register: UseFormRegister<ConsultFormData>;
  handleSubmit: UseFormHandleSubmit<ConsultFormData>;
  setValue: UseFormSetValue<ConsultFormData>;
  control: Control<ConsultFormData>;
  errors: FieldErrors<ConsultFormData>;
  isSubmitting: boolean;
  onSubmit: (data: ConsultFormData) => void;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  consultationType: "online" | "in-person";
  location: string;
  tattooType: "coverup" | "addon" | "between" | "";
  selectedDateTimes: DateTime[];
  uploadedPhotos: string[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  submitError: string | null;
  submitSuccess: boolean;
  events: Database["public"]["Tables"]["events"]["Row"][];
  consultDuration: number;
  breakTime: number;
}

const ConsultFormContent = ({
  artist,
  register,
  handleSubmit,
  setValue,
  control,
  errors,
  isSubmitting,
  onSubmit,
  locations,
  consultationType,
  location,
  tattooType,
  selectedDateTimes,
  uploadedPhotos,
  setUploadedPhotos,
  setUploadedFiles,
  submitError,
  submitSuccess,
  events,
  consultDuration,
  breakTime,
}: ConsultFormContentProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName" className="text-xl">
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
        <Label htmlFor="email" className="text-xl">
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
        <Label htmlFor="phoneNumber" className="text-xl">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...register("phoneNumber")}
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
        <Label htmlFor="cityCountry" className="text-xl">
          City/Country of Residence
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
        <Label className="text-xl">Tattoo Booking Location</Label>
        <LocationSelectModal
          value={location}
          onValueChange={(value) => {
            setValue("location", value, { shouldValidate: true });
          }}
          locations={locations}
        />
        <input
          type="hidden"
          {...register("location", {
            required: "Please select a location",
          })}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Tattoo Idea */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tattooIdea" className="text-xl">
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
        <Label className="text-xl">
          Is this a coverup/add on/or between existing tattoos (please include
          photo)
        </Label>
        <TattooTypeSelectModal
          value={tattooType}
          onValueChange={(value) =>
            setValue("tattooType", value as "coverup" | "addon" | "between")
          }
        />
      </div>

      {/* Upload Reference Photos */}
      <PhotoUpload
        photos={uploadedPhotos}
        onPhotoUpload={(files) => {
          const remainingSlots = 5 - uploadedPhotos.length;
          const filesArray = Array.from(files).slice(0, remainingSlots);

          // Store File objects for submission
          setUploadedFiles((prev) => [...prev, ...filesArray]);

          // Create preview URLs for display
          filesArray.forEach((file) => {
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
          setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
        }}
        maxPhotos={5}
        label="Upload Reference Photos"
      />

      {/* Legal Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="legalAge"
            control={control}
            rules={{
              required: "You must confirm you are of legal age to get tattooed",
            }}
            render={({ field }) => (
              <Checkbox
                id="legalAge"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="legalAge"
            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I am of legal age to get tattooed
          </Label>
        </div>
        {errors.legalAge && (
          <p className="text-sm text-destructive">{errors.legalAge.message}</p>
        )}

        <div className="flex items-center space-x-2">
          <Controller
            name="agreeToPolicies"
            control={control}
            rules={{
              required: "You must agree to the policies to continue",
            }}
            render={({ field }) => (
              <Checkbox
                id="agreeToPolicies"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="agreeToPolicies"
            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read & agree to the policies
          </Label>
        </div>
        {errors.agreeToPolicies && (
          <p className="text-sm text-destructive">
            {errors.agreeToPolicies.message}
          </p>
        )}
      </div>

      {/* Consultation Type Selection */}
      <div className="flex flex-col gap-3">
        <Label className="text-xl">Consultation Type</Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue("consultationType", "online")}
            disabled={artist?.flow?.consult_online === false}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
              consultationType === "online" ? "bg-secondary" : "bg-background"
            } ${
              artist?.flow?.consult_online === false
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm font-medium">ONLINE CONSULTATION</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("consultationType", "in-person")}
            disabled={artist?.flow?.consult_in_person === false}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
              consultationType === "in-person"
                ? "bg-secondary"
                : "bg-background"
            } ${
              artist?.flow?.consult_in_person === false
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
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
        selectedDates={selectedDateTimes.map((dt) => dt.date)}
        onDatesSelect={(dates) => {
          // When dates change, update the dateTimes array
          const newDateTimes = dates.map((dateStr) => {
            const existing = selectedDateTimes.find(
              (dt) => dt.date === dateStr
            );
            return existing || { date: dateStr, time: "" };
          });
          setValue("selectedDateTimes", newDateTimes, { shouldValidate: true });
        }}
        isMultiple={false}
        workDays={artist?.flow?.consult_work_days || undefined}
      />

      {/* Time Selection Accordion */}
      <TimeAccordion
        selectedDates={selectedDateTimes.map((dt) => dt.date)}
        selectedDateTimes={selectedDateTimes}
        onDateTimesSelect={(dateTimes) =>
          setValue("selectedDateTimes", dateTimes, { shouldValidate: true })
        }
        consultStartTimes={
          artist?.flow?.consult_start_times as
            | Record<string, string[]>
            | null
            | undefined
        }
        events={events}
        consultDuration={consultDuration}
        breakTime={breakTime}
      />
      <input
        type="hidden"
        {...register("selectedDateTimes", {
          validate: (value) => {
            if (value.length === 0)
              return "Please select at least one date and time";
            if (value.some((dt) => !dt.time))
              return "Please select a time for all selected dates";
            return true;
          },
        })}
      />
      {errors.selectedDateTimes && (
        <p className="text-sm text-destructive">
          {errors.selectedDateTimes.message}
        </p>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500 rounded-md">
          <p className="text-sm text-green-700 dark:text-green-400">
            Consultation request submitted successfully! We&apos;ll get back to
            you soon.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || submitSuccess}
        className="w-full rounded-full"
        size="lg"
      >
        {isSubmitting
          ? "Submitting..."
          : submitSuccess
          ? "Submitted!"
          : "Click Here to Confirm"}
      </Button>
    </form>
  );
};
