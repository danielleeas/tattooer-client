"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, X } from "lucide-react";
import type { Database } from "@/types/supabase";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  LocationSelectModal,
  TattooTypeSelectModal,
} from "@/components/common";
import Image from "next/image";

interface BookingClientProps {
  artistName: string;
  artistId: string;
  artist: Database["public"]["Tables"]["artists"]["Row"] | null;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  error: string | null;
}

interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  cityCountry: string;
  location: string;
  preferredDays: "any" | "weekdays" | "weekend";
  tattooIdea: string;
  tattooType: "coverup" | "addon" | "between" | "";
  photos: File[];
  legalAge: boolean;
  agreeToPolicies: boolean;
}

export function BookingClient({
  artistName,
  artistId,
  artist,
  locations,
  error,
}: BookingClientProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      cityCountry: "",
      location: "",
      preferredDays: "any",
      tattooIdea: "",
      tattooType: "",
      photos: [],
      legalAge: false,
      agreeToPolicies: false,
    },
    mode: "onChange",
  });

  const preferredDays = watch("preferredDays");
  const location = watch("location");
  const tattooType = watch("tattooType");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

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
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BookingFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { submitBookingRequest } = await import("./actions");

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("artistId", artistId);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("cityCountry", data.cityCountry);
      formData.append("locationId", data.location);
      formData.append("preferredDays", data.preferredDays);
      formData.append("tattooIdea", data.tattooIdea);
      formData.append("tattooType", data.tattooType);

      // Append all photo files
      uploadedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const result = await submitBookingRequest(formData);

      if (result.success) {
        setSubmitSuccess(true);
        // Optionally reset form or redirect
      } else {
        setSubmitError(result.error || "Failed to submit booking request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit booking request"
      );
    }
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
            {artist.full_name} -<br /> Booking Form
          </p>
        }
        icon="/assets/images/icons/portfolio.png"
        description="I'm happy you're here! Please fill out this short form so we can get started."
      />

      {/* Booking Form */}
      <BookingFormContent
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        uploadedPhotos={uploadedPhotos}
        handlePhotoUpload={handlePhotoUpload}
        removePhoto={removePhoto}
        locations={locations}
        preferredDays={preferredDays}
        location={location}
        tattooType={tattooType}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}

interface BookingFormContentProps {
  register: UseFormRegister<BookingFormData>;
  handleSubmit: UseFormHandleSubmit<BookingFormData>;
  setValue: UseFormSetValue<BookingFormData>;
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  isSubmitting: boolean;
  onSubmit: (data: BookingFormData) => void;
  uploadedPhotos: string[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  preferredDays: "any" | "weekdays" | "weekend";
  location: string;
  tattooType: "coverup" | "addon" | "between" | "";
  submitError: string | null;
  submitSuccess: boolean;
}

const BookingFormContent = ({
  register,
  handleSubmit,
  setValue,
  control,
  errors,
  isSubmitting,
  onSubmit,
  uploadedPhotos,
  handlePhotoUpload,
  removePhoto,
  locations,
  preferredDays,
  location,
  tattooType,
  submitError,
  submitSuccess,
}: BookingFormContentProps) => {
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
        <Label htmlFor="cityCountry" className="text-xl">
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

      {/* Preferred Days */}
      <div className="flex flex-col gap-2">
        <Label className="text-xl">Preferred days</Label>
        <RadioGroup
          value={preferredDays}
          onValueChange={(value: "any" | "weekdays" | "weekend") =>
            setValue("preferredDays", value)
          }
          className="flex gap-4 flex-col"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any" />
            <Label htmlFor="any" className="font-normal cursor-pointer">
              Any
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekdays" id="weekdays" />
            <Label htmlFor="weekdays" className="font-normal cursor-pointer">
              Weekdays
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekend" id="weekend" />
            <Label htmlFor="weekend" className="font-normal cursor-pointer">
              Weekend
            </Label>
          </div>
        </RadioGroup>
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
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="photos" className="text-xl">
            Upload Reference Photos (Max 5)
          </Label>
          <Image
            src={"/assets/images/icons/camera.png"}
            alt="Camera"
            width={32}
            height={32}
          />
        </div>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          disabled={uploadedPhotos.length >= 5}
          className="hidden"
        />
        <label
          htmlFor="photos"
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-md cursor-pointer hover:border-primary transition-colors"
        >
          <div className="text-center">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Click to upload photos
            </p>
          </div>
        </label>
        {uploadedPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
            Booking request submitted successfully! We&apos;ll get back to you
            soon.
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
          : "Looks Good — Continue"}
      </Button>
    </form>
  );
};
